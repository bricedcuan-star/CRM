import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabase.from('leads').insert({
    nombre: body.nombre,
    empresa: body.empresa || null,
    estado: 'nuevo',
    nivel_interes: Number(body.nivel_interes || 3),
    valor_estimado: Number(body.valor_estimado || 0),
    fecha_ultima_interaccion: new Date().toISOString(),
    fuente: 'web_externa',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
