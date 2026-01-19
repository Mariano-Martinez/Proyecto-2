import 'server-only';

import * as cheerio from 'cheerio';
import { sortEventsNewestFirst } from '../dates';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';

const CACHE_TTL_SECONDS_DEFAULT = 600;
const REQUEST_TIMEOUT_MS = 20000;
const TRACKING_URL = 'https://www.correoargentino.com.ar/sites/all/modules/custom/ca_forms/api/wsFacade.php';
const ORIGIN_URL = 'https://www.correoargentino.com.ar';
const REFERER_URL = 'https://www.correoargentino.com.ar/formularios/ondnc';

const normalizeTrackingNumber = (value: string) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

type CacheEntry = { data: TrackingNormalized; expiresAt: number };
const cache = new Map<string, CacheEntry>();

const getCacheTtlMs = () => {
  const raw = Number(process.env.CORREO_ARGENTINO_CACHE_TTL_SECONDS ?? CACHE_TTL_SECONDS_DEFAULT);
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

const parseTrackingNumber = (trackingNumber: string) => {
  const normalized = normalizeTrackingNumber(trackingNumber);
  const match = normalized.match(/^([A-Z]{2})(\d{9})([A-Z]{2})$/);
  if (!match) {
    throw new TrackingProviderError('Número de seguimiento inválido', 'INVALID_INPUT');
  }
  const [, producto, id, pais] = match;
  if (pais !== 'AR') {
    throw new TrackingProviderError('País no soportado para Correo Argentino', 'NOT_FOUND');
  }
  return { normalized, producto, id, pais };
};

const toIsoAr = (value: string) => {
  const match = value.match(/(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!match) return new Date().toISOString();
  const [, dd, mm, yyyy, hh = '00', min = '00'] = match;
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00-03:00`;
};

const mapCorreoStatusToEnum = (label: string): TrackingStatus => {
  const value = label.toLowerCase();
  if (value.includes('entregado') || value.includes('entregada')) return 'delivered';
  if (value.includes('ingreso al correo')) return 'created';
  return 'in_transit';
};

type ParsedTracking = {
  events: TrackingEvent[];
  statusLabel: string;
};

const parseTrackingHtml = (html: string): ParsedTracking => {
  const $ = cheerio.load(html);
  const rows = $('table.table.table-hover tbody tr');
  const events: TrackingEvent[] = [];
  let statusLabel = '';

  rows.each((index, tr) => {
    const tds = $(tr)
      .find('td')
      .map((_, td) => $(td).text().replace(/\s+/g, ' ').trim())
      .get();

    if (tds.length < 4) return;
    const [fecha, planta, historia, estado] = tds;
    if (!fecha && !historia && !estado) return;

    if (index === 0) {
      statusLabel = (estado || historia || '').trim();
    }

    const description = estado ? `${historia} — ${estado}` : historia || 'Evento';
    events.push({
      timestamp: toIsoAr(fecha),
      location: planta || null,
      description,
    });
  });

  return { events, statusLabel: statusLabel || 'Desconocido' };
};

const normalizeTracking = (trackingNumber: string, html: string): TrackingNormalized => {
  if (/PIEZA MAL INGRESADA/i.test(html)) {
    throw new TrackingProviderError('Pieza mal ingresada en Correo Argentino', 'NOT_FOUND');
  }

  const { events, statusLabel } = parseTrackingHtml(html);
  if (events.length === 0) {
    throw new TrackingProviderError('No se encontraron eventos de seguimiento', 'NOT_FOUND');
  }

  const sortedEvents = sortEventsNewestFirst(events);
  const newestEvent = sortedEvents[0];
  const status = mapCorreoStatusToEnum(statusLabel || newestEvent?.description || '');

  return {
    carrier: 'correoargentino',
    trackingNumber,
    statusLabel: statusLabel || newestEvent?.description || 'Desconocido',
    status,
    lastUpdated: newestEvent?.timestamp ?? null,
    events: sortedEvents,
  } satisfies TrackingNormalized;
};

const fetchCorreoTracking = async (producto: string, id: string, pais: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const body = new URLSearchParams({
      action: 'ondnc',
      id,
      producto,
      pais,
    });

    const response = await fetch(TRACKING_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'text/html, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: ORIGIN_URL,
        Referer: REFERER_URL,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new TrackingProviderError(`Correo Argentino respondió ${response.status}`, 'NETWORK', { status: response.status });
    }

    return await response.text();
  } catch (error) {
    if (error instanceof TrackingProviderError) {
      throw error;
    }
    if ((error as Error)?.name === 'AbortError') {
      throw new TrackingProviderError('Tiempo de espera agotado al consultar Correo Argentino', 'NETWORK', error);
    }
    throw new TrackingProviderError('Error inesperado al consultar Correo Argentino', 'UNEXPECTED', error);
  } finally {
    clearTimeout(timeout);
  }
};

export const correoArgentinoProvider: TrackingProvider = {
  carrier: 'correoargentino',
  async fetchTracking(trackingNumber: string): Promise<TrackingNormalized> {
    const { normalized, producto, id, pais } = parseTrackingNumber(trackingNumber);

    const cached = getCached(normalized);
    if (cached) return cached;

    const html = await fetchCorreoTracking(producto, id, pais);
    const normalizedTracking = normalizeTracking(normalized, html);
    setCached(normalized, normalizedTracking);
    return normalizedTracking;
  },
};
