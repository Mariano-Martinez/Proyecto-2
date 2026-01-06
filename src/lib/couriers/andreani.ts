import { Courier, ShipmentStatus, TimelineEvent } from '@/lib/types';

const DEFAULT_TRACKING_URL_TEMPLATE = process.env.ANDREANI_TRACKING_URL_TEMPLATE ?? 'https://www.andreani.com/#!/detalle-envio/{code}';
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

const parseDateString = (date: string, time?: string) => {
  const cleanDate = date.trim().toLowerCase();
  const timeParts = time?.trim().split(':') ?? [];
  const hour = Number(timeParts[0] ?? '00');
  const minute = Number(timeParts[1] ?? '00');

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
    /(\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}|\\d{1,2}\\s+(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\\s+\\d{4})/i;
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
    // Fallback: intentar detectar el estado principal como único evento.
    const status = mapStatus(text);
    events.push({
      id: `${code}-0`,
      label: 'Estado actualizado',
      date: new Date().toISOString(),
      location: undefined,
    });
    return events;
  }

  // Ordenar descendente por fecha.
  events.sort((a, b) => (a.date < b.date ? 1 : -1));
  return events;
};

export const fetchAndreaniPublicTracking = async (code: string): Promise<AndreaniTrackingPayload> => {
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
    throw new AndreaniScraperError(`Respuesta inesperada (${res.status})`, 'NETWORK_ERROR');
  }

  const html = await res.text();
  const plain = toPlainText(html);
  if (!plain) {
    throw new AndreaniScraperError('Contenido vacío al consultar Andreani', 'PARSING_ERROR');
  }

  const events = parseEventsFromText(plain, code);
  const statusFromEvents = events.length > 0 ? mapStatus(events[0].label) : undefined;
  const status = statusFromEvents ?? mapStatus(plain);
  const lastUpdated = events[0]?.date ?? new Date().toISOString();

  return {
    courier: Courier.ANDREANI,
    status,
    events,
    origin: undefined,
    destination: undefined,
    eta: undefined,
    lastUpdated,
  };
};
