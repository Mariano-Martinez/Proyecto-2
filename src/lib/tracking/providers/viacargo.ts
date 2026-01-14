import 'server-only';

import { sortEventsNewestFirst } from '../dates';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';
import { ViaCargoTrackingError, getViaCargoTrackingFromWeb } from '@/lib/viacargo/playwrightTracking';

const CACHE_TTL_SECONDS_DEFAULT = 600;

type CacheEntry = { data: TrackingNormalized; expiresAt: number };
const cache = new Map<string, CacheEntry>();

const getCacheTtlMs = () => {
  const raw = Number(process.env.VIACARGO_CACHE_TTL_SECONDS ?? CACHE_TTL_SECONDS_DEFAULT);
  if (!Number.isFinite(raw) || raw <= 0) return CACHE_TTL_SECONDS_DEFAULT * 1000;
  return raw * 1000;
};

const getCached = (trackingNumber: string) => {
  const entry = cache.get(trackingNumber);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(trackingNumber);
    return null;
  }
  return entry.data;
};

const setCached = (trackingNumber: string, data: TrackingNormalized) => {
  cache.set(trackingNumber, { data, expiresAt: Date.now() + getCacheTtlMs() });
};

const toIsoAr = (value?: string | null) => {
  if (!value) return new Date().toISOString();
  const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!match) return new Date().toISOString();
  const [, dd, mm, yyyy, hh = '00', min = '00'] = match;
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00-03:00`;
};

const mapViaCargoStatusToEnum = (label: string): TrackingStatus => {
  const value = label.toLowerCase();
  if (value.includes('entregad')) return 'delivered';
  if (value.includes('en reparto') || value.includes('reparto') || value.includes('distribuci')) return 'out_for_delivery';
  if (value.includes('en viaje') || value.includes('en tránsito') || value.includes('en transito') || value.includes('en camino')) {
    return 'in_transit';
  }
  if (value.includes('ingres') || value.includes('admit') || value.includes('recepcion')) return 'created';
  if (value.includes('demora') || value.includes('reten') || value.includes('incidenc') || value.includes('rechaz')) return 'exception';
  return 'unknown';
};

const buildEvents = (tracking: Awaited<ReturnType<typeof getViaCargoTrackingFromWeb>>): TrackingEvent[] =>
  tracking.listaEventos.map((event) => {
    const description = event.descripcion?.trim() || 'Evento';
    return {
      timestamp: toIsoAr(event.fechaEvento ?? undefined),
      location: event.deleNombre?.trim() || null,
      description,
      stage: description ? mapViaCargoStatusToEnum(description) : undefined,
    };
  });

const normalizeViaCargoTracking = (
  tracking: Awaited<ReturnType<typeof getViaCargoTrackingFromWeb>>,
  fallbackNumber: string
): TrackingNormalized => {
  const events = sortEventsNewestFirst(buildEvents(tracking));
  const newestEvent = events[0];
  const statusLabel = newestEvent?.description ?? 'Desconocido';
  const details = {
    service: tracking.descripcionServicio ?? undefined,
    pieces: tracking.numeroTotalPiezas ?? tracking.listaBultosLength ?? undefined,
    weightKg: tracking.kilos ?? undefined,
    origin: [tracking.direccionRemitente, tracking.poblacionRemitente].filter(Boolean).join(', ') || undefined,
    destination: [tracking.direccionDestinatario, tracking.poblacionDestinatario].filter(Boolean).join(', ') || undefined,
    signedByMasked: tracking.nifQuienRecibeMasked ?? null,
  };
  const hasDetails = Object.values(details).some((value) => value !== undefined && value !== null && value !== '');

  return {
    carrier: 'viacargo',
    trackingNumber: tracking.numeroEnvio ?? fallbackNumber,
    statusLabel,
    status: mapViaCargoStatusToEnum(statusLabel),
    lastUpdated: newestEvent?.timestamp ?? null,
    events,
    details: hasDetails ? details : undefined,
  } satisfies TrackingNormalized;
};

// Manual test: /api/tracking/refresh?carrier=viacargo&trackingNumber=999020063424
export const viacargoProvider: TrackingProvider = {
  carrier: 'viacargo',
  async fetchTracking(trackingNumber: string): Promise<TrackingNormalized> {
    const trimmed = trackingNumber.trim();
    if (!/^\d{6,}$/.test(trimmed)) {
      throw new TrackingProviderError('Número de seguimiento inválido', 'INVALID_INPUT');
    }

    const cached = getCached(trimmed);
    if (cached) return cached;

    try {
      const tracking = await getViaCargoTrackingFromWeb(trimmed);
      const normalized = normalizeViaCargoTracking(tracking, trimmed);
      setCached(trimmed, normalized);
      return normalized;
    } catch (error) {
      if (error instanceof ViaCargoTrackingError) {
        if (error.code === 'INVALID_INPUT') {
          throw new TrackingProviderError(error.message, 'INVALID_INPUT', error);
        }
        if (error.code === 'NOT_FOUND') {
          throw new TrackingProviderError(error.message, 'NOT_FOUND', error);
        }
        if (error.code === 'TIMEOUT' || error.code === 'UPSTREAM') {
          throw new TrackingProviderError(error.message, 'UPSTREAM', error);
        }
        throw new TrackingProviderError(error.message, 'UNEXPECTED', error);
      }
      if ((error as Error)?.name === 'TimeoutError') {
        throw new TrackingProviderError('Tiempo de espera agotado al consultar Via Cargo', 'UPSTREAM', error);
      }
      throw new TrackingProviderError('Error inesperado al consultar Via Cargo', 'UNEXPECTED', error);
    }
  },
};
