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
      if (error.code === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 });
      }
      if (error.code === 'PARSING_ERROR') {
        return NextResponse.json({ error: 'No se pudo interpretar la página de Andreani' }, { status: 422 });
      }
      if (error.code === 'NETWORK_ERROR') {
        return NextResponse.json({ error: 'Error al consultar Andreani' }, { status: 502 });
      }
    }
    console.error('Unexpected error scraping Andreani', error);
    return NextResponse.json({ error: 'Error inesperado al consultar Andreani' }, { status: 500 });
  }
}
