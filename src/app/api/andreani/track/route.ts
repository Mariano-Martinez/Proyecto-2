import { NextRequest, NextResponse } from 'next/server';
import { fetchTrackingByCarrier } from '@/lib/tracking/providers';
import { TrackingProviderError } from '@/lib/tracking/providers/types';

export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function GET(req: NextRequest) {
  const numero = req.nextUrl.searchParams.get('numero')?.trim() ?? '';
  if (!numero) {
    return NextResponse.json({ ok: false, error: 'Número de envío inválido' }, { status: 400, headers: noStoreHeaders });
  }

  try {
    const data = await fetchTrackingByCarrier('andreani', numero);
    return NextResponse.json({ ok: true, data }, { status: 200, headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof TrackingProviderError) {
      const status = error.code === 'INVALID_INPUT' ? 400 : error.code === 'UPSTREAM' ? 502 : 500;
      return NextResponse.json({ ok: false, error: error.message }, { status, headers: noStoreHeaders });
    }
    console.error('Unexpected Andreani tracking error', error);
    return NextResponse.json(
      { ok: false, error: 'Error inesperado al consultar Andreani' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
