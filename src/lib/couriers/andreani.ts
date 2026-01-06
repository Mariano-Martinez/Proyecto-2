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
  const withoutTags = withoutStyles.replace(/<[^>]+>/g, ' ');
  return withoutTags.replace(/\s+/g, ' ').trim();
};

const dateFromParts = (date: string, time?: string) => {
  const normalized = `${date} ${time ?? '00:00'}`;
  const [day, month, year, hour = '00', minute = '00'] = normalized.split(/[\s:-]+/);
  const iso = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).toISOString();
  return iso;
};

const mapStatus = (text: string): ShipmentStatus => {
  const value = text.toLowerCase();
  if (value.includes('entregado')) return ShipmentStatus.DELIVERED;
  if (value.includes('en camino') || value.includes('en viaje')) return ShipmentStatus.IN_TRANSIT;
  if (value.includes('pendiente de ingreso')) return ShipmentStatus.CREATED;
  if (value.includes('ingresado') || value.includes('ingreso')) return ShipmentStatus.DISPATCHED;
  if (value.includes('incidencia') || value.includes('visita fallida') || value.includes('no responde')) {
    return ShipmentStatus.ISSUE;
  }
  return ShipmentStatus.IN_TRANSIT;
};

const parseEventsFromText = (text: string, code: string): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  // Busca secuencias de fecha y hora con la descripción siguiente hasta la próxima fecha.
  const regex = /(\d{2}-\d{2}-\d{4})\s+(\d{2}:\d{2})?\s+([^]*?)(?=\d{2}-\d{2}-\d{4}|\bPreguntas frecuentes\b|$)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const date = match[1];
    const time = match[2];
    const description = match[3].replace(/\s+/g, ' ').trim();
    if (!description) continue;
    events.push({
      id: `${code}-${events.length}`,
      label: description,
      date: dateFromParts(date, time),
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

  const status = mapStatus(plain);
  const events = parseEventsFromText(plain, code);
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
