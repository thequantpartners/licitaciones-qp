import { createClient } from '@supabase/supabase-js';
import type { Tenant, LicitacionAuditada, TenantMetrics, TenantPortalData } from '@/types/portal';

export * from '@/types/portal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lovlsbjxzeiukygwpuvp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function getTenantPortalData(slug: string): Promise<TenantPortalData | null> {
  try {
    // 1. Obtener tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single();

    if (tenantError || !tenant) {
      console.error('[Supabase] Error al obtener tenant:', tenantError?.message);
      return null;
    }

    // 2. Obtener licitaciones auditadas
    const { data: licitaciones, error: licError } = await supabaseAdmin
      .from('licitaciones_auditadas')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false });

    if (licError) {
      console.error('[Supabase] Error al obtener licitaciones:', licError.message);
    }

    const items: LicitacionAuditada[] = (licitaciones || []).map((item) => ({
      ...item,
      monto_pen: Number(item.monto_pen) || 0,
      horas_ahorradas: Number(item.horas_ahorradas) || 0,
      score_viabilidad: Number(item.score_viabilidad) || 0,
      penalidades_criticas: Number(item.penalidades_criticas) || 0,
    }));

    // 3. Calcular métricas ejecutivas de ROI
    const pipeline_total_pen = items.reduce((acc, curr) => acc + curr.monto_pen, 0);
    const horas_ahorradas_total = items.reduce((acc, curr) => acc + curr.horas_ahorradas, 0);
    const penalidades_criticas_total = items.reduce((acc, curr) => acc + curr.penalidades_criticas, 0);
    const total_licitaciones = items.length;
    const viables_count = items.filter((i) => i.dictamen === 'VIABLE').length;
    const subsanables_count = items.filter((i) => i.dictamen === 'SUBSANABLE').length;
    const no_viables_count = items.filter((i) => i.dictamen === 'NO_VIABLE').length;
    const score_promedio = total_licitaciones > 0
      ? Math.round(items.reduce((acc, curr) => acc + curr.score_viabilidad, 0) / total_licitaciones)
      : 0;

    return {
      tenant,
      metrics: {
        pipeline_total_pen,
        horas_ahorradas_total,
        penalidades_criticas_total,
        total_licitaciones,
        viables_count,
        subsanables_count,
        no_viables_count,
        score_promedio,
      },
      licitaciones: items,
    };
  } catch (err: any) {
    console.error('[Supabase] Excepción en getTenantPortalData:', err.message);
    return null;
  }
}

export async function updateTenantWhatsAppNumber(slug: string, newNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanNumber = newNumber.replace(/\D/g, '');
    if (cleanNumber.length < 9) {
      return { success: false, message: 'El número debe contener al menos 9 dígitos válidos.' };
    }

    const { error } = await supabaseAdmin
      .from('tenants')
      .update({ whatsapp_destino: cleanNumber, updated_at: new Date().toISOString() })
      .eq('slug', slug);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: `Número actualizado a +${cleanNumber} con éxito.` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
