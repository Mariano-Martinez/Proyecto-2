import { ShipmentStatus, TimelineEvent } from '@/lib/types';
import { TrackingEvent, TrackingNormalized, TrackingStatus } from './types';

export const mapTrackingStatusToShipmentStatus = (status: TrackingStatus): ShipmentStatus => {
  switch (status) {
    case 'created':
      return ShipmentStatus.CREATED;
    case 'out_for_delivery':
      return ShipmentStatus.OUT_FOR_DELIVERY;
    case 'delivered':
      return ShipmentStatus.DELIVERED;
    case 'exception':
      return ShipmentStatus.ISSUE;
    case 'in_transit':
    case 'unknown':
    default:
      return ShipmentStatus.IN_TRANSIT;
  }
};

export const mapTrackingEventsToTimelineEvents = (events: TrackingEvent[], code?: string): TimelineEvent[] =>
  events.map((event, index) => ({
    id: `${code ?? 'tracking'}-${index}-${event.timestamp || 'sin-fecha'}`,
    label: event.description || 'Evento',
    date: event.timestamp || new Date().toISOString(),
    location: event.location ?? undefined,
  }));

export const mapTimelineEventsToTrackingEvents = (events: TimelineEvent[]): TrackingEvent[] =>
  events.map((event) => ({
    timestamp: event.date,
    location: event.location ?? null,
    description: event.label,
  }));

export const getTrackingLastUpdated = (tracking: TrackingNormalized): string =>
  tracking.lastUpdated ?? tracking.events[0]?.timestamp ?? new Date().toISOString();
