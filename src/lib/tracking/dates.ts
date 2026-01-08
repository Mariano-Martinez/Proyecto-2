import { TrackingEvent } from './types';

const formatParts = (parts: Intl.DateTimeFormatPart[]) => {
  const lookup = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  const day = lookup('day');
  const month = lookup('month');
  const year = lookup('year');
  const hour = lookup('hour');
  const minute = lookup('minute');
  return { day, month, year, hour, minute };
};

export function formatDateTimeEsAR(iso: string, variant: 'short' | 'full' = 'short'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  if (variant === 'full') {
    const formatter = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatParts(formatter.formatToParts(date));
    return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
  }

  const formatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatParts(formatter.formatToParts(date));
  return `${parts.day} ${parts.month}, ${parts.hour}:${parts.minute}`;
}

export function sortEventsNewestFirst(events: TrackingEvent[]): TrackingEvent[] {
  return events
    .map((event, index) => ({
      event,
      index,
      time: Date.parse(event.timestamp),
    }))
    .sort((a, b) => {
      const aValid = Number.isFinite(a.time);
      const bValid = Number.isFinite(b.time);
      if (aValid && bValid) return b.time - a.time;
      if (aValid) return -1;
      if (bValid) return 1;
      return a.index - b.index;
    })
    .map(({ event }) => event);
}
