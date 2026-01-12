export type CarrierId = 'andreani' | 'urbano' | 'oca' | 'correo_argentino' | 'dhl' | 'fedex' | 'ups' | 'other';

export type TrackingStatus = 'unknown' | 'created' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';

export interface TrackingEvent {
  timestamp: string;
  location?: string | null;
  description: string;
  stage?: TrackingStatus;
}

export interface TrackingNormalized {
  carrier: CarrierId;
  trackingNumber: string;
  statusLabel: string;
  status: TrackingStatus;
  lastUpdated?: string | null;
  events: TrackingEvent[];
}
