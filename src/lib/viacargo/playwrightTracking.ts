import 'server-only';

import { chromium } from 'playwright';

const PAGE_TIMEOUT_MS = 45000;
const REQUEST_TIMEOUT_MS = 45000;
const TRACKING_URL = process.env.VIACARGO_TRACKING_URL ?? 'https://viacargo.com.ar/seguimiento-de-envio/';
const USER_AGENT =
  process.env.VIACARGO_USER_AGENT ??
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36';

export type ViaCargoTrackingEvent = {
  descripcion?: string | null;
  deleNombre?: string | null;
  fechaEvento?: string | null;
};

export type ViaCargoTrackingPayload = {
  numeroEnvio: string | null;
  descripcionServicio?: string | null;
  numeroTotalPiezas?: number | null;
  kilos?: number | null;
  direccionRemitente?: string | null;
  poblacionRemitente?: string | null;
  direccionDestinatario?: string | null;
  poblacionDestinatario?: string | null;
  nifQuienRecibeMasked?: string | null;
  listaEventos: ViaCargoTrackingEvent[];
  listaBultosLength?: number | null;
};

export class ViaCargoTrackingError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_INPUT' | 'TIMEOUT' | 'NOT_FOUND' | 'UPSTREAM' | 'UNEXPECTED',
    public cause?: unknown
  ) {
    super(message);
    this.name = 'ViaCargoTrackingError';
  }
}

const normalizeNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.'));
    return Number.isFinite(normalized) ? normalized : null;
  }
  return null;
};

const maskSignedBy = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return null;
  const visible = digits.length >= 4 ? 4 : Math.min(3, digits.length);
  const maskedPrefix = '*'.repeat(Math.max(digits.length - visible, 4));
  return `${maskedPrefix}${digits.slice(-visible)}`;
};

const normalizeTrackingPayload = (raw: any): ViaCargoTrackingPayload => ({
  numeroEnvio: raw?.numeroEnvio ?? null,
  descripcionServicio: raw?.descripcionServicio ?? null,
  numeroTotalPiezas: normalizeNumber(raw?.numeroTotalPiezas),
  kilos: normalizeNumber(raw?.kilos),
  direccionRemitente: raw?.direccionRemitente ?? null,
  poblacionRemitente: raw?.poblacionRemitente ?? null,
  direccionDestinatario: raw?.direccionDestinatario ?? null,
  poblacionDestinatario: raw?.poblacionDestinatario ?? null,
  nifQuienRecibeMasked: maskSignedBy(raw?.nifQuienRecibe ?? raw?.nifQuienRecibeMasked ?? null),
  listaEventos: Array.isArray(raw?.listaEventos)
    ? raw.listaEventos.map((event: any) => ({
        descripcion: event?.descripcion ?? null,
        deleNombre: event?.deleNombre ?? null,
        fechaEvento: event?.fechaEvento ?? null,
      }))
    : [],
  listaBultosLength: Array.isArray(raw?.listaBultos) ? raw.listaBultos.length : null,
});

const getTrackingInput = async (page: import('playwright').Page) => {
  const byRole = page.getByRole('textbox', { name: /número|numero|envío|envio|seguimiento|guía|guia/i });
  if ((await byRole.count()) > 0) return byRole.first();
  const fallback = page.locator(
    'input[name="NumeroEnvio"], input[id*="NumeroEnvio"], input[placeholder*="Número"], input[placeholder*="Numero"], input[type="text"]'
  );
  return fallback.first();
};

const getSubmitButton = async (page: import('playwright').Page) => {
  const byRole = page.getByRole('button', { name: /consultar|buscar/i });
  if ((await byRole.count()) > 0) return byRole.first();
  const fallback = page.locator(
    'button:has-text("Consultar"), button:has-text("Buscar"), input[type="submit"][value*="Consultar"], input[type="submit"][value*="Buscar"]'
  );
  return fallback.first();
};

export const getViaCargoTrackingFromWeb = async (numeroEnvio: string): Promise<ViaCargoTrackingPayload> => {
  const trimmed = numeroEnvio.trim();
  if (!/^\d{6,}$/.test(trimmed)) {
    throw new ViaCargoTrackingError('Número de seguimiento inválido', 'INVALID_INPUT');
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'es-AR',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);
    page.setDefaultNavigationTimeout(PAGE_TIMEOUT_MS);

    await page.goto(TRACKING_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS });

    const input = await getTrackingInput(page);
    await input.waitFor({ timeout: REQUEST_TIMEOUT_MS });
    await input.fill(trimmed);

    const trackingResponsePromise = page.waitForResponse(
      (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] ?? '';
        return (
          url.includes('/api/alerce/tracking') &&
          url.includes(`NumeroEnvio=${trimmed}`) &&
          response.status() === 200 &&
          contentType.includes('application/json')
        );
      },
      { timeout: REQUEST_TIMEOUT_MS }
    );

    const button = await getSubmitButton(page);
    if ((await button.count()) > 0) {
      await button.click({ timeout: REQUEST_TIMEOUT_MS });
    } else {
      await input.press('Enter');
    }

    const trackingResponse = await trackingResponsePromise;
    const payload = await trackingResponse.json();
    const hasErrors = Array.isArray(payload?.errores) && payload.errores.length > 0;
    const okList = Array.isArray(payload?.ok) ? payload.ok : [];
    if (hasErrors || okList.length === 0) {
      throw new ViaCargoTrackingError('No encontramos el envío en Via Cargo', 'NOT_FOUND');
    }
    const raw = okList[0]?.objeto ?? null;
    if (!raw) {
      throw new ViaCargoTrackingError('No encontramos el envío en Via Cargo', 'NOT_FOUND');
    }

    return normalizeTrackingPayload(raw);
  } catch (error) {
    if (error instanceof ViaCargoTrackingError) {
      throw error;
    }
    if ((error as Error)?.name === 'TimeoutError') {
      throw new ViaCargoTrackingError('Tiempo de espera agotado al consultar Via Cargo', 'TIMEOUT', error);
    }
    throw new ViaCargoTrackingError('Error inesperado al consultar Via Cargo', 'UNEXPECTED', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
