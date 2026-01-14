import { CarrierId, TrackingNormalized } from '../types';
import { TrackingProvider, TrackingProviderError } from './types';
import { andreaniProvider } from './andreani';
import { urbanoProvider } from './urbano';

const unsupportedProvider = (carrier: CarrierId): TrackingProvider => ({
  carrier,
  fetchTracking: async () => {
    throw new TrackingProviderError(`Carrier no soportado: ${carrier}`, 'UNSUPPORTED');
  },
});

export const trackingProviders: Record<CarrierId, TrackingProvider> = {
  andreani: andreaniProvider,
  urbano: urbanoProvider,
  oca: unsupportedProvider('oca'),
  correo_argentino: unsupportedProvider('correo_argentino'),
  dhl: unsupportedProvider('dhl'),
  fedex: unsupportedProvider('fedex'),
  ups: unsupportedProvider('ups'),
  other: unsupportedProvider('other'),
};

export async function fetchTrackingByCarrier(carrier: CarrierId, trackingNumber: string): Promise<TrackingNormalized> {
  const provider = trackingProviders[carrier];
  if (!provider) {
    throw new TrackingProviderError(`Carrier no soportado: ${carrier}`, 'UNSUPPORTED');
  }
  return provider.fetchTracking(trackingNumber);
}
