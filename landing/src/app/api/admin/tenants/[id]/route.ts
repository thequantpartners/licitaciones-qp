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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.alertas_activas === 'boolean') {
      updatePayload.alertas_activas = body.alertas_activas;
    }

    if (typeof body.whatsapp_destino === 'string') {
      let clean = body.whatsapp_destino.replace(/\D/g, '');
      if (clean.length === 9) clean = `51${clean}`;
      updatePayload.whatsapp_destino = clean;
    }

    if (body.plan) {
      updatePayload.plan = body.plan;
    }

    if (body.palabras_clave) {
      updatePayload.palabras_clave = Array.isArray(body.palabras_clave)
        ? body.palabras_clave
        : String(body.palabras_clave)
            .split(',')
            .map((k: string) => k.trim().toUpperCase())
            .filter(Boolean);
    }

    if (body.razon_social) updatePayload.razon_social = body.razon_social.trim();
    if (body.nombre_comercial) updatePayload.nombre_comercial = body.nombre_comercial.trim();
    if (body.rubro) updatePayload.rubro = body.rubro.trim();

    const { data: updated, error } = await supabaseAdmin
      .from('tenants')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tenant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // 1. Eliminar licitaciones auditadas asociadas
    await supabaseAdmin.from('licitaciones_auditadas').delete().eq('tenant_id', id);

    // 2. Eliminar tenant
    const { error } = await supabaseAdmin.from('tenants').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Tenant eliminado correctamente.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
