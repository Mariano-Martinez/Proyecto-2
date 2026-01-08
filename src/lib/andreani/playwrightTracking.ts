import 'server-only';

import { chromium } from 'playwright';
import { AndreaniTrackingNormalized } from './types';

const CACHE_TTL_SECONDS_DEFAULT = 600;
const PAGE_TIMEOUT_MS = 15000;
const USER_AGENT =
  process.env.ANDREANI_USER_AGENT ??
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36';

type CacheEntry = { data: AndreaniTrackingNormalized; expiresAt: number };
const cache = new Map<string, CacheEntry>();

export class AndreaniTrackingError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_INPUT' | 'TIMEOUT' | 'NOT_FOUND' | 'UNEXPECTED',
    public cause?: unknown
  ) {
    super(message);
    this.name = 'AndreaniTrackingError';
  }
}

export const validateShipmentNumber = (numero: string) => /^\d{8,25}$/.test(numero);

const getCacheTtlMs = () => {
  const raw = Number(process.env.ANDREANI_CACHE_TTL_SECONDS ?? CACHE_TTL_SECONDS_DEFAULT);
  if (!Number.isFinite(raw) || raw <= 0) return CACHE_TTL_SECONDS_DEFAULT * 1000;
  return raw * 1000;
};

const getCached = (numero: string) => {
  const entry = cache.get(numero);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(numero);
    return null;
  }
  return entry.data;
};

const setCached = (numero: string, data: AndreaniTrackingNormalized) => {
  cache.set(numero, { data, expiresAt: Date.now() + getCacheTtlMs() });
};

const normalizeTracking = (rawJson: any): AndreaniTrackingNormalized => ({
  numeroAndreani: rawJson?.numeroAndreani ?? null,
  estado: rawJson?.procesoActual?.titulo ?? null,
  fechaUltimoEvento: rawJson?.procesoActual?.fechaUltimoEvento ?? null,
  timelines: Array.isArray(rawJson?.timelines)
    ? rawJson.timelines.map((timeline: any) => ({
        orden: timeline?.orden ?? null,
        titulo: timeline?.titulo ?? null,
        eventos: Array.isArray(timeline?.traducciones)
          ? timeline.traducciones.map((evento: any) => ({
              fecha: evento?.fechaEvento ?? null,
              texto: evento?.traduccion ?? null,
              sucursalNombre: evento?.sucursal?.nombre ?? null,
            }))
          : [],
      }))
    : [],
});

export const getAndreaniTrackingFromWeb = async (numero: string): Promise<AndreaniTrackingNormalized> => {
  const cached = getCached(numero);
  if (cached) return cached;

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'es-AR',
    });
    const page = await context.newPage();

    const trackingResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('tracking-api.andreani.com/api/v3/Tracking?payload=') && response.status() === 200,
      { timeout: PAGE_TIMEOUT_MS }
    );

    await page.goto(`https://www.andreani.com/envio/${numero}`, {
      waitUntil: 'domcontentloaded',
      timeout: PAGE_TIMEOUT_MS,
    });

    const trackingResponse = await trackingResponsePromise;
    const rawJson = await trackingResponse.json();
    const normalized = normalizeTracking(rawJson);
    setCached(numero, normalized);
    return normalized;
  } catch (error) {
    if ((error as Error)?.name === 'TimeoutError') {
      throw new AndreaniTrackingError('Tiempo de espera agotado al consultar Andreani', 'TIMEOUT', error);
    }
    throw new AndreaniTrackingError('Error inesperado al consultar Andreani', 'UNEXPECTED', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
