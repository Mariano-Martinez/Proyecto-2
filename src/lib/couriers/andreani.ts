import { Courier, ShipmentStatus, TimelineEvent } from '@/lib/types';

const DEFAULT_TRACKING_URL_TEMPLATE = process.env.ANDREANI_TRACKING_URL_TEMPLATE ?? 'https://www.andreani.com/#!/detalle-envio/{code}';
const ANDREANI_API_BASE = process.env.ANDREANI_TRACKING_API_BASE ?? 'https://tracking-api.andreani.com';
const ANDREANI_ORIGIN = process.env.ANDREANI_TRACKING_ORIGIN ?? 'https://www.andreani.com';
const ANDREANI_AUTH = process.env.ANDREANI_TRACKING_AUTH;
const USER_AGENT =
  process.env.ANDREANI_USER_AGENT ??
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

export type AndreaniTrackingPayload = {
  courier: Courier;
  status: ShipmentStatus;
  events: TimelineEvent[];
  origin?: string;
  destination?: string;
  eta?: string;
  lastUpdated: string;
  debugInfo?: {
    eventsFromText: number;
    eventsFromLines: number;
    eventsFromJson: number;
    eventsFromApi?: number;
    apiStatus?: number;
    apiStatusV1?: number;
    apiStatusV3?: number;
    apiPayloadFound?: boolean;
    apiError?: string;
    apiCookieCaptured?: boolean;
    plainLength: number;
    htmlLength: number;
    plainSample?: string;
  };
};

export class AndreaniScraperError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'PARSING_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN',
    public cause?: unknown
  ) {
    super(message);
    this.name = 'AndreaniScraperError';
  }
}

const buildTrackingUrl = (code: string) => DEFAULT_TRACKING_URL_TEMPLATE.replace('{code}', encodeURIComponent(code));

const toPlainText = (html: string) => {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // Preserva saltos básicos para separar bloques antes de normalizar espacios.
  const withNewlines = withoutStyles.replace(/<\/(div|p|li|br|tr)>/gi, '\n');
  const withoutTags = withNewlines.replace(/<[^>]+>/g, ' ');
  return withoutTags.replace(/[ \t]+\n/g, '\n').replace(/\s+/g, ' ').trim();
};

const mapStatus = (text: string): ShipmentStatus => {
  const value = text.toLowerCase();
  if (value.includes('entregado') || value.includes('entrega')) return ShipmentStatus.DELIVERED;
  if (value.includes('en camino') || value.includes('en viaje') || value.includes('transito') || value.includes('tránsito')) {
    return ShipmentStatus.IN_TRANSIT;
  }
  if (value.includes('pendiente de ingreso') || value.includes('pendiente')) return ShipmentStatus.CREATED;
  if (value.includes('ingresado') || value.includes('ingreso') || value.includes('preparacion')) return ShipmentStatus.DISPATCHED;
  if (value.includes('listo para retiro') || value.includes('out for delivery') || value.includes('en reparto')) {
    return ShipmentStatus.OUT_FOR_DELIVERY;
  }
  if (value.includes('incidencia') || value.includes('visita fallida') || value.includes('no responde') || value.includes('demorado')) {
    return ShipmentStatus.ISSUE;
  }
  if (value.includes('entregado')) return ShipmentStatus.DELIVERED;
  return ShipmentStatus.IN_TRANSIT;
};

type ParsedFromJson = {
  events: TimelineEvent[];
  origin?: string;
  destination?: string;
  eta?: string;
};
type ExtractedJsonResult = ParsedFromJson & { rawEventCount: number };

const monthToNumber: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

const extractEventsFromUnknown = (value: unknown, code: string): ExtractedJsonResult | null => {
  const collected: TimelineEvent[] = [];
  let origin: string | undefined;
  let destination: string | undefined;
  let eta: string | undefined;
  const visited = new WeakSet();

  const considerEvent = (obj: Record<string, unknown>) => {
    const keys = Object.keys(obj);
    const dateKey = keys.find((k) => /fecha|date/i.test(k));
    const labelKey = keys.find((k) => /descripcion|description|detalle|estado|status|mensaje|event/i.test(k));
    if (!dateKey || !labelKey) return;
    const timeKey = keys.find((k) => /hora|time|hour/i.test(k));
    const locationKey = keys.find((k) => /lugar|ubicacion|location/i.test(k));
    const dateValue = obj[dateKey];
    const labelValue = obj[labelKey];
    if (typeof dateValue !== 'string' || typeof labelValue !== 'string') return;
    const parsedDate = parseDateString(dateValue, typeof obj[timeKey!] === 'string' ? (obj[timeKey!] as string) : undefined);
    collected.push({
      id: `${code}-${collected.length}`,
      label: labelValue.trim(),
      date: parsedDate,
      location: typeof obj[locationKey!] === 'string' ? (obj[locationKey!] as string).trim() : undefined,
    });
  };

  const considerStringEvent = (val: string) => {
    const lineEvents = parseEventsFromStrings([val], code);
    lineEvents.forEach((ev) => collected.push(ev));
  };

  const walk = (val: unknown) => {
    if (val && typeof val === 'object') {
      if (visited.has(val as object)) return;
      visited.add(val as object);
    }
    if (Array.isArray(val)) {
      val.forEach(walk);
      return;
    }
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>;
      considerEvent(obj);
      if (!origin) {
        const originKey = Object.keys(obj).find((k) => /origen|origin/i.test(k));
        if (originKey && typeof obj[originKey] === 'string') origin = (obj[originKey] as string).trim();
      }
      if (!destination) {
        const destKey = Object.keys(obj).find((k) => /destino|destination/i.test(k));
        if (destKey && typeof obj[destKey] === 'string') destination = (obj[destKey] as string).trim();
      }
      if (!eta) {
        const etaKey = Object.keys(obj).find((k) => /eta|estimad/i.test(k));
        if (etaKey && typeof obj[etaKey] === 'string') eta = (obj[etaKey] as string).trim();
      }
      Object.values(obj).forEach(walk);
      return;
    }
    if (typeof val === 'string') {
      considerStringEvent(val);
    }
  };

  walk(value);

  if (collected.length === 0 && !origin && !destination && !eta) return null;

  const events = [...collected].sort((a, b) => (a.date < b.date ? 1 : -1));
  return { events, origin, destination, eta, rawEventCount: collected.length };
};

const maybeExtractJsonState = (html: string, code: string): ParsedFromJson | null => {
  const scriptMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return null;
  const content = scriptMatch[1];
  try {
    const json = JSON.parse(content);
    const extracted = extractEventsFromUnknown(json, code);
    if (!extracted) return null;
    return { events: extracted.events, origin: extracted.origin, destination: extracted.destination, eta: extracted.eta };
  } catch (error) {
    return null;
  }
};

const parseDateString = (date: string, time?: string) => {
  const cleanDate = date.trim().toLowerCase();
  const timeParts = time?.trim().split(':') ?? [];
  const hour = Number(timeParts[0] ?? '00');
  const minute = Number(timeParts[1] ?? '00');

  // ISO or Date-parsable string
  const asDate = new Date(date);
  if (!Number.isNaN(asDate.getTime()) && date.includes('T')) {
    return asDate.toISOString();
  }

  // dd/mm/yyyy or dd-mm-yyyy
  const slashMatch = cleanDate.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    const year = Number(y.length === 2 ? `20${y}` : y);
    const month = Number(m) - 1;
    return new Date(year, month, Number(d), hour, minute).toISOString();
  }

  // dd mon yyyy (mon in es)
  const textMatch = cleanDate.match(/(\d{1,2})\s+([a-zñ]+)\s+(\d{4})/);
  if (textMatch) {
    const [, d, mon, y] = textMatch;
    const month = monthToNumber[mon.slice(0, 3)] ?? 0;
    return new Date(Number(y), month, Number(d), hour, minute).toISOString();
  }

  // fallback now
  return new Date().toISOString();
};

const parseEventsFromText = (text: string, code: string): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  // Busca secuencias de fecha y hora (formato 06-01-2026 09:40, 06/01/2026 09:40 o 6 ene 2026 09:40)
  const datePattern =
    /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\s+\d{4})/i;
  const regex = new RegExp(
    `${datePattern.source}\\s+(\\d{2}:\\d{2})?\\s+([^]*?)(?=${datePattern.source}|\\bPreguntas frecuentes\\b|$)`,
    'gi'
  );

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const date = match[1];
    const time = match[2];
    const description = match[3].replace(/\s+/g, ' ').trim();
    if (!description) continue;
    const parsedDate = parseDateString(date, time);
    events.push({
      id: `${code}-${events.length}`,
      label: description,
      date: parsedDate,
    });
  }

  if (events.length === 0) {
    return events;
  }

  // Ordenar descendente por fecha.
  events.sort((a, b) => (a.date < b.date ? 1 : -1));
  return events;
};

const parseEventsFromStrings = (lines: string[], code: string): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const datePattern =
    /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\s+\d{4})/i;
  lines.forEach((line) => {
    const trimmed = line.trim();
    const dateMatch = trimmed.match(datePattern);
    if (!dateMatch) return;
    const timeMatch = trimmed.match(/\b(\d{2}:\d{2})\b/);
    const label = trimmed.replace(datePattern, '').replace(/\b\d{2}:\d{2}\b/, '').trim();
    const parsedDate = parseDateString(dateMatch[0], timeMatch ? timeMatch[1] : undefined);
    events.push({
      id: `${code}-txt-${events.length}`,
      label: label || trimmed,
      date: parsedDate,
    });
  });
  events.sort((a, b) => (a.date < b.date ? 1 : -1));
  return events;
};

const buildApiHeaders = () => {
  const headers: Record<string, string> = {
    'user-agent': USER_AGENT,
    accept: 'application/json, text/plain, */*',
    origin: ANDREANI_ORIGIN,
    referer: `${ANDREANI_ORIGIN}/`,
  };
  if (ANDREANI_AUTH) headers.authorization = ANDREANI_AUTH;
  return headers;
};

type ApiAttemptDebug = {
  apiStatus?: number;
  apiStatusV1?: number;
  apiStatusV3?: number;
  apiPayloadFound?: boolean;
  eventsFromApi: number;
  apiError?: string;
  apiCookieCaptured?: boolean;
};

const extractPayloadToken = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractPayloadToken(item);
      if (found) return found;
    }
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.payload === 'string') return obj.payload;
    for (const v of Object.values(obj)) {
      const found = extractPayloadToken(v);
      if (found) return found;
    }
  }
  return undefined;
};

const tryFetchAndreaniApiTracking = async (code: string): Promise<{ payload?: AndreaniTrackingPayload; debug: ApiAttemptDebug }> => {
  const headers = buildApiHeaders();
  const debug: ApiAttemptDebug = { eventsFromApi: 0 };
  let cookie: string | undefined;

  try {
    const payloadRes = await fetch(
      `${ANDREANI_API_BASE}/api/v1/BultosPorEnvio/?numero=${encodeURIComponent(code)}`,
      {
        headers,
        cache: 'no-store',
      }
    );
    debug.apiStatus = payloadRes.status;
    debug.apiStatusV1 = payloadRes.status;
    if (!payloadRes.ok) {
      debug.apiError = `v1 status ${payloadRes.status}`;
      return { debug };
    }
    const setCookie = payloadRes.headers.get('set-cookie');
    if (setCookie) {
      // Mantener la cookie de sesión si la API la requiere para el v3.
      cookie = setCookie.split(',')[0];
      debug.apiCookieCaptured = true;
    }
    const payloadJson = await payloadRes.json();
    const payloadToken = extractPayloadToken(payloadJson);
    debug.apiPayloadFound = Boolean(payloadToken);
    if (!payloadToken) {
      debug.apiError = 'v1 sin payload';
      return { debug };
    }

    const trackingRes = await fetch(
      `${ANDREANI_API_BASE}/api/v3/Tracking?payload=${encodeURIComponent(payloadToken)}`,
      {
        headers: cookie ? { ...headers, cookie } : headers,
        cache: 'no-store',
      }
    );
    debug.apiStatus = trackingRes.status;
    debug.apiStatusV3 = trackingRes.status;
    if (!trackingRes.ok) {
      debug.apiError = `v3 status ${trackingRes.status}`;
      return { debug };
    }
    const trackingJson = await trackingRes.json();
    const parsed = extractEventsFromUnknown(trackingJson, code);
    if (!parsed || parsed.events.length === 0) {
      debug.apiError = 'v3 sin eventos';
      return { debug };
    }

    const status = mapStatus(parsed.events[0].label);
    const lastUpdated = parsed.events[0]?.date ?? new Date().toISOString();
    const payload: AndreaniTrackingPayload = {
      courier: Courier.ANDREANI,
      status,
      events: parsed.events,
      origin: parsed.origin,
      destination: parsed.destination,
      eta: parsed.eta,
      lastUpdated,
      debugInfo: {
        eventsFromText: 0,
        eventsFromLines: 0,
        eventsFromJson: parsed.rawEventCount,
        eventsFromApi: parsed.rawEventCount,
        apiStatus: trackingRes.status,
        apiStatusV1: debug.apiStatusV1,
        apiStatusV3: trackingRes.status,
        apiPayloadFound: debug.apiPayloadFound,
        plainLength: 0,
        htmlLength: 0,
      },
    };

    return {
      payload,
      debug: { ...debug, eventsFromApi: parsed.events.length },
    };
  } catch (error) {
    debug.apiError = (error as Error)?.message ?? 'Error desconocido en API';
    return { debug };
  }
};

const scrapeAndreaniHtmlTracking = async (
  code: string,
  baseDebug?: Partial<AndreaniTrackingPayload['debugInfo']>
): Promise<AndreaniTrackingPayload> => {
  const url = buildTrackingUrl(code);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'user-agent': USER_AGENT,
      },
      cache: 'no-store',
    });
  } catch (error) {
    throw new AndreaniScraperError('Error de red al consultar Andreani', 'NETWORK_ERROR', error);
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new AndreaniScraperError('Envío no encontrado en Andreani', 'NOT_FOUND');
    }
    const networkError = new Error(`Respuesta inesperada (${res.status}) ${res.statusText}`);
    throw new AndreaniScraperError(`Respuesta inesperada (${res.status})`, 'NETWORK_ERROR', networkError);
  }

  const html = await res.text();
  const jsonParsed = maybeExtractJsonState(html, code);
  const plain = toPlainText(html);
  if (!plain && (!jsonParsed || jsonParsed.events.length === 0)) {
    throw new AndreaniScraperError('Contenido vacío al consultar Andreani', 'PARSING_ERROR');
  }

  const eventsFromText = plain ? parseEventsFromText(plain, code) : [];
  const eventsFromLines = plain ? parseEventsFromStrings(plain.split('\n'), code) : [];
  const combinedEvents = [...eventsFromText, ...eventsFromLines];
  combinedEvents.sort((a, b) => (a.date < b.date ? 1 : -1));

  const events = jsonParsed?.events?.length ? jsonParsed.events : combinedEvents;
  const statusFromEvents = events.length > 0 ? mapStatus(events[0].label) : undefined;
  const status = statusFromEvents ?? mapStatus(plain ?? '');
  const lastUpdated = events[0]?.date ?? new Date().toISOString();

  const debugInfo = {
    eventsFromText: eventsFromText.length,
    eventsFromLines: eventsFromLines.length,
    eventsFromJson: jsonParsed?.events?.length ?? 0,
    eventsFromApi: baseDebug?.eventsFromApi,
    apiStatus: baseDebug?.apiStatus,
    apiPayloadFound: baseDebug?.apiPayloadFound,
    apiError: baseDebug?.apiError,
    plainLength: plain?.length ?? 0,
    htmlLength: html.length,
    plainSample: plain?.slice(0, 300),
  };

  const finalEvents =
    events.length > 0
      ? events
      : [
          {
            id: `${code}-fallback`,
            label: plain?.slice(0, 120) || 'Estado actualizado',
            date: lastUpdated,
          },
        ];

  return {
    courier: Courier.ANDREANI,
    status,
    events: finalEvents,
    origin: jsonParsed?.origin,
    destination: jsonParsed?.destination,
    eta: jsonParsed?.eta,
    lastUpdated,
    debugInfo,
  };
};

export const fetchAndreaniPublicTracking = async (code: string): Promise<AndreaniTrackingPayload> => {
  const apiAttempt = await tryFetchAndreaniApiTracking(code);
  if (apiAttempt.payload && apiAttempt.payload.events.length > 0) {
    return apiAttempt.payload;
  }

  // fallback a scraping HTML si la API no devolvió eventos o falló.
  const baseDebug = {
    eventsFromApi: apiAttempt.debug.eventsFromApi,
    apiStatus: apiAttempt.debug.apiStatus,
    apiStatusV1: apiAttempt.debug.apiStatusV1,
    apiStatusV3: apiAttempt.debug.apiStatusV3,
    apiPayloadFound: apiAttempt.debug.apiPayloadFound,
    apiError: apiAttempt.debug.apiError,
    apiCookieCaptured: apiAttempt.debug.apiCookieCaptured,
  };

  const scraped = await scrapeAndreaniHtmlTracking(code, baseDebug);
  // combinar debug info enriqueciendo con la traza del intento API
  scraped.debugInfo = {
    eventsFromText: scraped.debugInfo?.eventsFromText ?? 0,
    eventsFromLines: scraped.debugInfo?.eventsFromLines ?? 0,
    eventsFromJson: scraped.debugInfo?.eventsFromJson ?? 0,
    eventsFromApi: baseDebug.eventsFromApi ?? scraped.debugInfo?.eventsFromApi,
    apiStatus: baseDebug.apiStatus ?? scraped.debugInfo?.apiStatus,
    apiStatusV1: baseDebug.apiStatusV1 ?? scraped.debugInfo?.apiStatusV1,
    apiStatusV3: baseDebug.apiStatusV3 ?? scraped.debugInfo?.apiStatusV3,
    apiPayloadFound: baseDebug.apiPayloadFound ?? scraped.debugInfo?.apiPayloadFound,
    apiError: baseDebug.apiError ?? scraped.debugInfo?.apiError,
    apiCookieCaptured: baseDebug.apiCookieCaptured ?? scraped.debugInfo?.apiCookieCaptured,
    plainLength: scraped.debugInfo?.plainLength ?? 0,
    htmlLength: scraped.debugInfo?.htmlLength ?? 0,
    plainSample: scraped.debugInfo?.plainSample,
  };
  return scraped;
};
