import { NextRequest, NextResponse } from 'next/server';
import { AndreaniTrackingError, getAndreaniTrackingFromWeb, validateShipmentNumber } from '@/lib/andreani/playwrightTracking';

export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function GET(req: NextRequest) {
  const numero = req.nextUrl.searchParams.get('numero')?.trim() ?? '';
  if (!validateShipmentNumber(numero)) {
    return NextResponse.json({ ok: false, error: 'Número de envío inválido' }, { status: 400, headers: noStoreHeaders });
  }

  try {
    const data = await getAndreaniTrackingFromWeb(numero);
    return NextResponse.json({ ok: true, data }, { status: 200, headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof AndreaniTrackingError) {
      if (error.code === 'TIMEOUT') {
        return NextResponse.json({ ok: false, error: error.message }, { status: 504, headers: noStoreHeaders });
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: noStoreHeaders });
    }
    console.error('Unexpected Andreani tracking error', error);
    return NextResponse.json(
      { ok: false, error: 'Error inesperado al consultar Andreani' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
