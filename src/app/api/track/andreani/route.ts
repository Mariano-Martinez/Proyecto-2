import { NextRequest, NextResponse } from 'next/server';
import { Courier } from '@/lib/types';
import { AndreaniScraperError, fetchAndreaniPublicTracking } from '@/lib/couriers/andreani';

export async function POST(req: NextRequest) {
  let code: string | undefined;
  try {
    const body = await req.json();
    code = body?.code?.toString().trim();
  } catch (error) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (!code || code.length < 8) {
    return NextResponse.json({ error: 'Código de envío requerido' }, { status: 400 });
  }

  try {
    const tracking = await fetchAndreaniPublicTracking(code);
    return NextResponse.json({
      code,
      courier: Courier.ANDREANI,
      ...tracking,
    });
  } catch (error) {
    if (error instanceof AndreaniScraperError) {
      const details = error.cause instanceof Error ? error.cause.message : undefined;
      const payload = { error: error.message, code: error.code, details };
      if (error.code === 'NOT_FOUND') return NextResponse.json(payload, { status: 404 });
      if (error.code === 'PARSING_ERROR') return NextResponse.json(payload, { status: 422 });
      if (error.code === 'NETWORK_ERROR') return NextResponse.json(payload, { status: 502 });
      return NextResponse.json(payload, { status: 500 });
    }
    console.error('Unexpected error scraping Andreani', error);
    return NextResponse.json(
      { error: 'Error inesperado al consultar Andreani', details: (error as Error)?.message },
      { status: 500 }
    );
  }
}
