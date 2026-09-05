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
    return NextResponse.json({ error: 'No autorizado. Se requiere acceso de superadmin.' }, { status: 401 });
  }

  try {
    // 1. Obtener todos los tenants
    const { data: tenants, error: tenantsError } = await supabaseAdmin
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantsError) {
      return NextResponse.json({ error: tenantsError.message }, { status: 500 });
    }

    // 2. Obtener estadísticas por tenant
    const { data: licitaciones, error: licError } = await supabaseAdmin
      .from('licitaciones_auditadas')
      .select('tenant_id, monto_pen, dictamen, penalidades_criticas');

    const statsMap: Record<string, { total_licitaciones: number; pipeline_pen: number; viables: number }> = {};

    if (!licError && licitaciones) {
      for (const item of licitaciones) {
        if (!statsMap[item.tenant_id]) {
          statsMap[item.tenant_id] = { total_licitaciones: 0, pipeline_pen: 0, viables: 0 };
        }
        statsMap[item.tenant_id].total_licitaciones += 1;
        statsMap[item.tenant_id].pipeline_pen += Number(item.monto_pen) || 0;
        if (item.dictamen === 'VIABLE') {
          statsMap[item.tenant_id].viables += 1;
        }
      }
    }

    const enhancedTenants = (tenants || []).map((t) => ({
      ...t,
      stats: statsMap[t.id] || { total_licitaciones: 0, pipeline_pen: 0, viables: 0 },
    }));

    return NextResponse.json({ tenants: enhancedTenants });
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
    const {
      ruc,
      razon_social,
      nombre_comercial,
      slug: customSlug,
      rubro,
      palabras_clave,
      whatsapp_destino,
      plan = 'PILOTO_FUNDADOR',
      alertas_activas = true,
      enviar_bienvenida = false,
      sembrar_demo = true,
    } = body;

    // 1. Validaciones estrictas
    if (!ruc || ruc.trim().length !== 11 || !/^\d+$/.test(ruc.trim())) {
      return NextResponse.json(
        { error: 'El RUC debe ser un número de exactamente 11 dígitos válido ante SUNAT.' },
        { status: 400 }
      );
    }

    if (!razon_social || razon_social.trim().length < 3) {
      return NextResponse.json(
        { error: 'La Razón Social es obligatoria (mínimo 3 caracteres).' },
        { status: 400 }
      );
    }

    // 2. Normalizar Slug
    let slug = customSlug
      ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
      : (nombre_comercial || razon_social)
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

    if (!slug) {
      slug = `empresa-${ruc.trim().slice(-6)}`;
    }

    // Verificar unicidad de Slug
    const { data: existingSlug } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // 3. Normalizar número celular peruano
    let cleanPhone = (whatsapp_destino || '').replace(/\D/g, '');
    if (cleanPhone.length === 9) {
      cleanPhone = `51${cleanPhone}`;
    }

    if (cleanPhone && (cleanPhone.length < 11 || !cleanPhone.startsWith('519'))) {
      return NextResponse.json(
        { error: 'El número de WhatsApp debe ser un celular peruano de 9 dígitos (ej. 987654321).' },
        { status: 400 }
      );
    }

    // 4. Normalizar palabras clave
    let keywordsArray: string[] = [];
    if (Array.isArray(palabras_clave)) {
      keywordsArray = palabras_clave;
    } else if (typeof palabras_clave === 'string') {
      keywordsArray = palabras_clave
        .split(',')
        .map((k) => k.trim().toUpperCase())
        .filter(Boolean);
    }
    if (keywordsArray.length === 0) {
      keywordsArray = ['MEDICO', 'HOSPITALARIO'];
    }

    // 5. Insertar Tenant en Supabase
    const { data: newTenant, error: insertError } = await supabaseAdmin
      .from('tenants')
      .insert({
        slug,
        ruc: ruc.trim(),
        razon_social: razon_social.trim(),
        nombre_comercial: (nombre_comercial || razon_social).trim(),
        rubro: (rubro || 'Contrataciones del Estado').trim(),
        palabras_clave: keywordsArray,
        whatsapp_destino: cleanPhone,
        alertas_activas,
        plan,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 6. Sembrar licitación inicial de muestra (EsSalud Piura) si se solicitó
    if (sembrar_demo && newTenant) {
      await supabaseAdmin.from('licitaciones_auditadas').insert({
        tenant_id: newTenant.id,
        nomenclatura: 'CP SER-SM-3-2026-ESSALUD/RAPI-1',
        entidad: 'Seguro Social de Salud - Red Asistencial Piura',
        objeto: 'Servicio de Mantenimiento Preventivo y Correctivo de Equipos Médicos e Imagenología',
        monto_pen: 2850000,
        score_viabilidad: 75,
        dictamen: 'SUBSANABLE',
        penalidades_criticas: 8,
        horas_ahorradas: 18.5,
        pdf_cdn_url:
          'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf',
        detalles: {
          resumen: 'Expediente auditado automáticamente. Score 75/100 con 8 penalidades críticas detectadas.',
        },
      });
    }

    // 7. Encolar mensaje de bienvenida a WhatsApp si se solicitó y hay número
    if (enviar_bienvenida && cleanPhone) {
      const portalUrl = `https://licitaciones.thequantpartners.com/portal/${slug}`;
      const bienvenidaMsg =
        `🏛️ *LICITACIONES QP • ACTIVACIÓN DE RADAR EJECUTIVO*\n\n` +
        `Estimado(a) equipo de *${razon_social}* (RUC: ${ruc}),\n\n` +
        `Le damos la bienvenida a la infraestructura de inteligencia para contrataciones públicas de *The Quant Partners*.\n\n` +
        `📡 *Radar de Vigilancia Activo:* SEACE 3.0\n` +
        `🎯 *Rubros Monitoreados:* ${keywordsArray.join(', ')}\n` +
        `⏰ *Frecuencia:* Auditoría diaria automática a las 06:00 AM\n\n` +
        `📊 *Acceda a su Portal Ejecutivo Looker:*\n${portalUrl}\n\n` +
        `📄 *Primer Dictamen Pericial Disponible:*\n` +
        `CP SER-SM-3-2026-ESSALUD/RAPI-1 (S/. 2,850,000.00 PEN)\n` +
        `https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf\n\n` +
        `_Servicio activo. Si desea cambiar sus palabras clave o destinatarios, responda a este mensaje o modifíquelo en su portal._`;

      await supabaseAdmin.from('alertas_despacho').insert({
        telefono: cleanPhone,
        tipo: 'BIENVENIDA_CLIENTE',
        mensaje: bienvenidaMsg,
        pdf_url:
          'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf',
        consentimiento_ley29733: true,
        estado: 'PENDIENTE',
      });
    }

    return NextResponse.json({
      success: true,
      tenant: newTenant,
      portalUrl: `https://licitaciones.thequantpartners.com/portal/${slug}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
