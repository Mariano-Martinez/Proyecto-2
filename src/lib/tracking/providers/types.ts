import { CarrierId, TrackingNormalized } from '../types';

export type TrackingProviderErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UPSTREAM' | 'UNSUPPORTED' | 'UNEXPECTED';

export class TrackingProviderError extends Error {
  constructor(message: string, public code: TrackingProviderErrorCode, public cause?: unknown) {
    super(message);
    this.name = 'TrackingProviderError';
  }
}

export interface TrackingProvider {
  carrier: CarrierId;
  fetchTracking(trackingNumber: string): Promise<TrackingNormalized>;
}
