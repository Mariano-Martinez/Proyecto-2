import 'server-only';

import { sortEventsNewestFirst } from '../dates';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';

const CACHE_TTL_SECONDS_DEFAULT = 600;
const REQUEST_TIMEOUT_MS = 15000;
const TRACKING_URL = 'https://formularios.viacargo.com.ar/api/alerce/tracking';
const REFERER_URL = 'https://formularios.viacargo.com.ar/seguimiento-envio';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36';

type ViaCargoEvent = {
  descripcion?: string | null;
  deleNombre?: string | null;
  fechaEvento?: string | null;
};

type ViaCargoTrackingPayload = {
  numeroEnvio?: string | null;
  descripcionServicio?: string | null;
  kilos?: number | string | null;
  numeroTotalPiezas?: number | string | null;
  nifQuienRecibe?: string | null;
  nifQuienRecibeMasked?: string | null;
  poblacionRemitente?: string | null;
  oficinaRemitente?: string | null;
  poblacionDestinatario?: string | null;
  oficinaDestinatario?: string | null;
  listaEventos?: ViaCargoEvent[];
};

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

const normalizeNumber = (value?: number | string | null) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.'));
    return Number.isFinite(normalized) ? normalized : undefined;
  }
  return undefined;
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

const buildEvents = (events: ViaCargoEvent[]): TrackingEvent[] =>
  events.map((event) => {
    const description = event.descripcion?.trim() || 'Evento';
    return {
      timestamp: toIsoAr(event.fechaEvento ?? undefined),
      location: event.deleNombre?.trim() || null,
      description,
      stage: description ? mapViaCargoStatusToEnum(description) : undefined,
    };
  });

const maskSignedBy = (value?: string | null) => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  const visible = digits.length >= 4 ? 4 : Math.min(3, digits.length);
  const maskedPrefix = '*'.repeat(Math.max(digits.length - visible, 4));
  return `${maskedPrefix}${digits.slice(-visible)}`;
};

const buildLocationLabel = (parts: Array<string | null | undefined>) => {
  const filtered = parts.map((part) => part?.trim()).filter(Boolean) as string[];
  return filtered.length > 0 ? filtered.join(' - ') : undefined;
};

const normalizeViaCargoTracking = (tracking: ViaCargoTrackingPayload, fallbackNumber: string): TrackingNormalized => {
  const events = sortEventsNewestFirst(buildEvents(tracking.listaEventos ?? []));
  const newestEvent = events[0];
  const statusLabel = newestEvent?.description ?? 'Desconocido';
  const details = {
    service: tracking.descripcionServicio ?? undefined,
    pieces: normalizeNumber(tracking.numeroTotalPiezas),
    weightKg: normalizeNumber(tracking.kilos),
    origin: buildLocationLabel([tracking.poblacionRemitente, tracking.oficinaRemitente]),
    destination: buildLocationLabel([tracking.poblacionDestinatario, tracking.oficinaDestinatario]),
    signedByMasked: maskSignedBy(tracking.nifQuienRecibe ?? tracking.nifQuienRecibeMasked ?? null),
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

const getViaCargoTrackingFromApi = async (trackingNumber: string): Promise<ViaCargoTrackingPayload> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const url = new URL(TRACKING_URL);
    url.searchParams.set('NumeroEnvio', trackingNumber);

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        Referer: REFERER_URL,
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new TrackingProviderError(
        `Via Cargo respondió ${response.status}`,
        'NETWORK',
        response.status === 0 ? undefined : { status: response.status }
      );
    }

    const payload = (await response.json()) as {
      ok?: Array<{ objeto?: ViaCargoTrackingPayload | null }> | null;
      errores?: Array<{ mensaje?: string | null }> | null;
    };
    const errores = Array.isArray(payload?.errores) ? payload.errores : [];
    if (errores.length > 0) {
      throw new TrackingProviderError('Via Cargo devolvió errores al consultar el envío', 'UPSTREAM_ERROR');
    }
    const okList = Array.isArray(payload?.ok) ? payload.ok : [];
    const objeto = okList[0]?.objeto ?? null;
    if (!objeto) {
      throw new TrackingProviderError('No encontramos el envío en Via Cargo', 'NOT_FOUND');
    }
    return objeto;
  } catch (error) {
    if (error instanceof TrackingProviderError) {
      throw error;
    }
    if ((error as Error)?.name === 'AbortError') {
      throw new TrackingProviderError('Tiempo de espera agotado al consultar Via Cargo', 'NETWORK', error);
    }
    throw new TrackingProviderError('Error inesperado al consultar Via Cargo', 'UNEXPECTED', error);
  } finally {
    clearTimeout(timeout);
  }
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

    const tracking = await getViaCargoTrackingFromApi(trimmed);
    const normalized = normalizeViaCargoTracking(tracking, trimmed);
    setCached(trimmed, normalized);
    return normalized;
  },
};
