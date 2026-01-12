import 'server-only';

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { sortEventsNewestFirst } from '../dates';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';

const CACHE_TTL_SECONDS_DEFAULT = 600;
const PAGE_TIMEOUT_MS = 15000;
const USER_AGENT =
  process.env.URBANO_USER_AGENT ??
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36';

type CacheEntry = { data: TrackingNormalized; expiresAt: number };
const cache = new Map<string, CacheEntry>();

const validateTrackingNumber = (trackingNumber: string) => /^\d{8,}$/.test(trackingNumber);

const getCacheTtlMs = () => {
  const raw = Number(process.env.URBANO_CACHE_TTL_SECONDS ?? CACHE_TTL_SECONDS_DEFAULT);
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

const buildTrackingUrl = (trackingNumber: string) => {
  const shi = trackingNumber.slice(0, 4);
  const cli = trackingNumber.slice(4);
  return `https://apis.urbano.com.ar/cespecifica/?shi_codigo=${shi}&cli_codigo=${cli}`;
};

const toIsoAr = (ddmmyyyy: string, hhmm: string) => {
  const [dd, mm, yyyy] = ddmmyyyy.split('-');
  if (!dd || !mm || !yyyy) return new Date().toISOString();
  const time = hhmm && hhmm.includes(':') ? hhmm : '00:00';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${time}:00-03:00`;
};

const mapUrbanoStatusToEnum = (label: string): TrackingStatus => {
  const value = label.trim().toLowerCase();
  if (value.startsWith('dl') || value.includes('entregado')) return 'delivered';
  if (value.startsWith('ei')) return 'out_for_delivery';
  if (value.startsWith('ld') || value.includes('en camino')) return 'in_transit';
  if (value.includes('ingresado') || value.includes('pendiente')) return 'created';
  return 'unknown';
};

const extractEvents = (html: string): TrackingEvent[] => {
  const $ = cheerio.load(html);
  const h3 = $('h3')
    .filter((_, el) => $(el).text().toLowerCase().includes('seguimiento de pieza'))
    .first();
  let table = h3.nextAll('table').first();
  if (!table.length) {
    table = $('table').first();
  }

  const bodyRows = table.find('tbody tr');
  const rows = bodyRows.length ? bodyRows : table.find('tr').slice(1);

  const events: TrackingEvent[] = [];
  rows.each((_, tr) => {
    const tds = $(tr)
      .find('td')
      .map((_, td) => $(td).text().replace(/\s+/g, ' ').trim())
      .get();
    if (tds.length < 4) return;
    const description = tds[1] ?? '';
    const fecha = tds[2] ?? '';
    const hora = tds[3] ?? '';
    const agencia = tds[4] ?? '';
    if (!description && !fecha) return;

    const timestamp = toIsoAr(fecha, hora);
    events.push({
      timestamp,
      location: agencia || null,
      description: description || 'Evento',
      stage: description ? mapUrbanoStatusToEnum(description) : undefined,
    });
  });

  return events;
};

const normalizeTracking = (trackingNumber: string, html: string): TrackingNormalized => {
  const events = extractEvents(html);
  if (events.length === 0) {
    throw new TrackingProviderError('No se encontraron eventos de seguimiento', 'NOT_FOUND');
  }

  const newestEvent = events[events.length - 1] ?? events[0];
  const statusLabel = newestEvent?.description ?? 'Desconocido';
  const sortedEvents = sortEventsNewestFirst(events);

  return {
    carrier: 'urbano',
    trackingNumber,
    statusLabel,
    status: mapUrbanoStatusToEnum(statusLabel),
    lastUpdated: newestEvent?.timestamp ?? sortedEvents[0]?.timestamp ?? null,
    events: sortedEvents,
  } satisfies TrackingNormalized;
};

export const urbanoProvider: TrackingProvider = {
  carrier: 'urbano',
  async fetchTracking(trackingNumber: string): Promise<TrackingNormalized> {
    const trimmed = trackingNumber.trim();
    if (!validateTrackingNumber(trimmed)) {
      throw new TrackingProviderError('Número de seguimiento inválido', 'INVALID_INPUT');
    }

    const cached = getCached(trimmed);
    if (cached) return cached;

    let browser;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[urbano.provider] fetching', trimmed);
      }
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: USER_AGENT,
        locale: 'es-AR',
      });
      const page = await context.newPage();
      const resultUrl = buildTrackingUrl(trimmed);

      const detalleResPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/cespecifica/class/especifica_controller.php') && response.status() === 200,
        { timeout: PAGE_TIMEOUT_MS }
      );

      await page.goto(resultUrl, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS });

      let clicked = false;
      try {
        await page.getByText('Detalle', { exact: false }).first().click({ timeout: 5000 });
        clicked = true;
      } catch (error) {
        try {
          await page.locator('img[src*="zoom"]').first().click({ timeout: 5000 });
          clicked = true;
        } catch (innerError) {
          throw new TrackingProviderError('No se pudo abrir el detalle del seguimiento', 'UPSTREAM', innerError);
        }
      }

      if (!clicked) {
        throw new TrackingProviderError('No se pudo abrir el detalle del seguimiento', 'UPSTREAM');
      }

      const detalleRes = await detalleResPromise;
      const html = await detalleRes.text();
      const normalized = normalizeTracking(trimmed, html);
      setCached(trimmed, normalized);
      return normalized;
    } catch (error) {
      if (error instanceof TrackingProviderError) {
        throw error;
      }
      if ((error as Error)?.name === 'TimeoutError') {
        throw new TrackingProviderError('Tiempo de espera agotado al consultar Urbano', 'UPSTREAM', error);
      }
      throw new TrackingProviderError('Error inesperado al consultar Urbano', 'UNEXPECTED', error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
};
