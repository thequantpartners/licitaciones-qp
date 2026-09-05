import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export interface TenantRecord {
  id: string;
  slug: string;
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  rubro: string;
  palabras_clave: string[];
  whatsapp_destino: string;
  alertas_activas: boolean;
  plan: string;
}

export interface LicitacionAuditadaInput {
  tenant_id: string;
  nomenclatura: string;
  entidad: string;
  objeto: string;
  monto_pen: number;
  score_viabilidad: number;
  dictamen: 'VIABLE' | 'SUBSANABLE' | 'NO_VIABLE';
  penalidades_criticas: number;
  horas_ahorradas?: number;
  pdf_cdn_url: string;
  detalles?: Record<string, any>;
}

export class SupabaseDatabase {
  private static client: SupabaseClient | null = null;

  private static getClient(): SupabaseClient | null {
    if (this.client) return this.client;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[SupabaseDB] Credenciales de Supabase no configuradas.');
      return null;
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return this.client;
  }

  /**
   * Obtiene todos los tenants activos que coinciden con el objeto o rubro de una licitación
   */
  static async obtenerTenantsParaLicitacion(objeto: string): Promise<TenantRecord[]> {
    const client = this.getClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('tenants')
        .select('*')
        .eq('alertas_activas', true);

      if (error || !data) {
        console.error('[SupabaseDB] Error al consultar tenants:', error?.message);
        return [];
      }

      const objetoLower = objeto.toLowerCase();

      // Filtrar por palabras clave del tenant
      const matchingTenants = data.filter((tenant: TenantRecord) => {
        if (!tenant.palabras_clave || tenant.palabras_clave.length === 0) return true;
        return tenant.palabras_clave.some((kw) => objetoLower.includes(kw.toLowerCase()));
      });

      // Si ninguno coincide específicamente por palabra clave, asociar al tenant de demostración por defecto
      if (matchingTenants.length === 0 && data.length > 0) {
        return [data[0]];
      }

      return matchingTenants;
    } catch (err: any) {
      console.error('[SupabaseDB] Excepción en obtenerTenantsParaLicitacion:', err.message);
      return [];
    }
  }

  /**
   * Registra una licitación auditada en la base de datos de Supabase
   */
  static async registrarLicitacion(input: LicitacionAuditadaInput): Promise<string | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('licitaciones_auditadas')
        .insert({
          tenant_id: input.tenant_id,
          nomenclatura: input.nomenclatura,
          entidad: input.entidad,
          objeto: input.objeto,
          monto_pen: input.monto_pen,
          score_viabilidad: input.score_viabilidad,
          dictamen: input.dictamen,
          penalidades_criticas: input.penalidades_criticas,
          horas_ahorradas: input.horas_ahorradas || 18.5,
          pdf_cdn_url: input.pdf_cdn_url,
          detalles: input.detalles || {},
        })
        .select('id')
        .single();

      if (error) {
        console.error('[SupabaseDB] Error al registrar licitación auditada:', error.message);
        return null;
      }

      console.log(`✅ [SupabaseDB] Licitación registrada exitosamente con ID: ${data.id}`);
      return data.id;
    } catch (err: any) {
      console.error('[SupabaseDB] Excepción en registrarLicitacion:', err.message);
      return null;
    }
  }

  /**
   * Obtiene el número de WhatsApp receptor configurado para un tenant específico
   */
  static async obtenerWhatsappTenant(tenantId: string): Promise<string> {
    const client = this.getClient();
    if (!client) return process.env.WHATSAPP_TARGET_NUMBERS || '51924464410';

    try {
      const { data, error } = await client
        .from('tenants')
        .select('whatsapp_destino')
        .eq('id', tenantId)
        .single();

      if (error || !data?.whatsapp_destino) {
        return process.env.WHATSAPP_TARGET_NUMBERS || '51924464410';
      }

      return data.whatsapp_destino;
    } catch {
      return process.env.WHATSAPP_TARGET_NUMBERS || '51924464410';
    }
  }
}
