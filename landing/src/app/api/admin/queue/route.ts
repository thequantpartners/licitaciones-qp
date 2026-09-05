import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'QP-ADMIN-2026';

function isAuthorized(request: NextRequest): boolean {
  const cookie = request.cookies.get('qp_admin_session');
  if (cookie?.value === 'authenticated') return true;

  const authHeader = request.headers.get('x-admin-key');
  if (authHeader === ADMIN_SECRET) return true;

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const { data: alerts, error } = await supabaseAdmin
      .from('alertas_despacho')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ queue: alerts || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { telefono, tenant_name, custom_message } = body;

    let clean = (telefono || '').replace(/\D/g, '');
    if (clean.length === 9) clean = `51${clean}`;

    if (clean.length < 11 || !clean.startsWith('519')) {
      return NextResponse.json(
        { error: 'Ingrese un número celular peruano válido (ej. 987654321).' },
        { status: 400 }
      );
    }

    const pdfUrl =
      'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf';

    const msg =
      custom_message ||
      `🏛️ *LICITACIONES QP • TEST DE CONECTIVIDAD*\n\n` +
      `Estimado(a) *${tenant_name || 'Cliente'}*,\n\n` +
      `Este es un mensaje de prueba pericial emitido desde el centro de comando de *The Quant Partners*.\n\n` +
      `📄 *Reporte Pericial de Muestra (A4):*\n${pdfUrl}\n\n` +
      `✅ _Su canal de recepción directa se encuentra 100% verificado y operativo en nuestro cluster de Railway._`;

    const { data, error } = await supabaseAdmin
      .from('alertas_despacho')
      .insert({
        telefono: clean,
        tipo: 'TEST_ADMIN',
        mensaje: msg,
        pdf_url: pdfUrl,
        consentimiento_ley29733: true,
        estado: 'PENDIENTE',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Alerta de prueba encolada con éxito para +${clean}. Railway la entregará en segundos.`,
      item: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
