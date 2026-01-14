import { NextRequest, NextResponse } from 'next/server';
import { fetchTrackingByCarrier } from '@/lib/tracking/providers';
import { CarrierId } from '@/lib/tracking/types';
import { TrackingProviderError } from '@/lib/tracking/providers/types';

export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

const carrierValues: CarrierId[] = ['andreani', 'urbano', 'viacargo', 'oca', 'correo_argentino', 'dhl', 'fedex', 'ups', 'other'];

const isCarrierId = (value: string): value is CarrierId => carrierValues.includes(value as CarrierId);

export async function GET(req: NextRequest) {
  const carrierParam = req.nextUrl.searchParams.get('carrier')?.trim() ?? '';
  const trackingNumber = req.nextUrl.searchParams.get('trackingNumber')?.trim() ?? '';

  if (!carrierParam || !isCarrierId(carrierParam)) {
    return NextResponse.json({ ok: false, error: 'Carrier inválido' }, { status: 400, headers: noStoreHeaders });
  }

  if (!trackingNumber) {
    return NextResponse.json({ ok: false, error: 'Número de seguimiento requerido' }, { status: 400, headers: noStoreHeaders });
  }

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[tracking.refresh]', { carrier: carrierParam, trackingNumber });
    }
    const data = await fetchTrackingByCarrier(carrierParam, trackingNumber);
    return NextResponse.json({ ok: true, data }, { status: 200, headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof TrackingProviderError) {
      const status =
        error.code === 'INVALID_INPUT' || error.code === 'UNSUPPORTED'
          ? 400
          : error.code === 'NOT_FOUND'
            ? 404
            : error.code === 'UPSTREAM' || error.code === 'UPSTREAM_ERROR' || error.code === 'NETWORK'
              ? 502
              : 500;
      return NextResponse.json({ ok: false, error: error.message }, { status, headers: noStoreHeaders });
    }
    console.error('Unexpected tracking refresh error', error);
    return NextResponse.json({ ok: false, error: 'Error inesperado al consultar el tracking' }, { status: 500, headers: noStoreHeaders });
  }
}
