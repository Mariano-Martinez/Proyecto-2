import 'server-only';

import { AndreaniTrackingError, getAndreaniTrackingFromWeb, validateShipmentNumber } from '@/lib/andreani/playwrightTracking';
import { htmlToPlainText } from '../sanitize';
import { sortEventsNewestFirst } from '../dates';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';

const CACHE_TTL_SECONDS_DEFAULT = 600;

type CacheEntry = { data: TrackingNormalized; expiresAt: number };
const cache = new Map<string, CacheEntry>();

const getCacheTtlMs = () => {
  const raw = Number(process.env.ANDREANI_CACHE_TTL_SECONDS ?? CACHE_TTL_SECONDS_DEFAULT);
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

const mapAndreaniStatusToEnum = (label: string): TrackingStatus => {
  const value = label.toLowerCase();
  if (value.includes('entregado')) return 'delivered';
  if (value.includes('en camino')) return 'in_transit';
  if (value.includes('ingresado') || value.includes('pendiente')) return 'created';
  return 'unknown';
};

const buildEvents = (tracking: Awaited<ReturnType<typeof getAndreaniTrackingFromWeb>>, fallbackDate: string): TrackingEvent[] =>
  tracking.timelines.flatMap((timeline) =>
    timeline.eventos.map((evento) => {
      const description = htmlToPlainText(evento.texto ?? '') || 'Evento';
      return {
        timestamp: evento.fecha ?? fallbackDate,
        location: evento.sucursalNombre ?? null,
        description,
        stage: description ? mapAndreaniStatusToEnum(description) : undefined,
      };
    })
  );

const normalizeAndreaniTracking = (tracking: Awaited<ReturnType<typeof getAndreaniTrackingFromWeb>>, fallbackNumber: string) => {
  const fallbackDate = tracking.fechaUltimoEvento ?? new Date().toISOString();
  const events = sortEventsNewestFirst(buildEvents(tracking, fallbackDate));
  const statusLabel = tracking.estado ?? 'Desconocido';
  return {
    carrier: 'andreani',
    trackingNumber: tracking.numeroAndreani ?? fallbackNumber,
    statusLabel,
    status: mapAndreaniStatusToEnum(statusLabel),
    lastUpdated: tracking.fechaUltimoEvento ?? events[0]?.timestamp ?? null,
    eta: tracking.fechaEstimadaEntrega ?? null,
    events,
  } satisfies TrackingNormalized;
};

export const andreaniProvider: TrackingProvider = {
  carrier: 'andreani',
  async fetchTracking(trackingNumber: string): Promise<TrackingNormalized> {
    const trimmed = trackingNumber.trim();
    if (!validateShipmentNumber(trimmed)) {
      throw new TrackingProviderError('Número de seguimiento inválido', 'INVALID_INPUT');
    }

    const cached = getCached(trimmed);
    if (cached) return cached;

    try {
      const tracking = await getAndreaniTrackingFromWeb(trimmed);
      const normalized = normalizeAndreaniTracking(tracking, trimmed);
      setCached(trimmed, normalized);
      return normalized;
    } catch (error) {
      if (error instanceof AndreaniTrackingError) {
        throw new TrackingProviderError(error.message, error.code === 'TIMEOUT' ? 'UPSTREAM' : 'UNEXPECTED', error);
      }
      throw new TrackingProviderError('Error inesperado al consultar Andreani', 'UNEXPECTED', error);
    }
  },
};
