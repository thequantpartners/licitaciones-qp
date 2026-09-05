export interface Tenant {
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
  created_at: string;
  updated_at: string;
}

export interface LicitacionAuditada {
  id: string;
  tenant_id: string;
  nomenclatura: string;
  entidad: string;
  objeto: string;
  monto_pen: number;
  score_viabilidad: number;
  dictamen: 'VIABLE' | 'SUBSANABLE' | 'NO_VIABLE';
  penalidades_criticas: number;
  horas_ahorradas: number;
  pdf_cdn_url: string;
  detalles: any;
  created_at: string;
}

export interface TenantMetrics {
  pipeline_total_pen: number;
  horas_ahorradas_total: number;
  penalidades_criticas_total: number;
  total_licitaciones: number;
  viables_count: number;
  subsanables_count: number;
  no_viables_count: number;
  score_promedio: number;
}

export interface TenantPortalData {
  tenant: Tenant;
  metrics: TenantMetrics;
  licitaciones: LicitacionAuditada[];
}
