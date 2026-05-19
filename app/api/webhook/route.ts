import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, empresa, email, interes } = body;

    const { data, error } = await supabase
      .from('leads')
      .insert([{ nombre, empresa, email, interes, estado: 'Nuevo' }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 });
  }
}
