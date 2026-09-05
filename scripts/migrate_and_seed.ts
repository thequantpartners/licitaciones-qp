import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'lovlsbjxzeiukygwpuvp';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('Falta variable SUPABASE_ACCESS_TOKEN en .env');
  process.exit(1);
}

async function runSql(sql: string, description: string) {
  console.log(`\n--- Executing: ${description} ---`);
  const res = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const text = await res.text();
  if (res.status >= 200 && res.status < 300) {
    console.log(`✅ Success (${res.status})`);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        console.log(`Rows returned: ${parsed.length}`);
      }
    } catch {
      console.log('Result:', text);
    }
  } else {
    console.error(`❌ Failed (${res.status}):`, text);
    throw new Error(`SQL execution failed: ${text}`);
  }
}

async function main() {
  const schemaSql = `
    -- 1. Tenants Table
    CREATE TABLE IF NOT EXISTS public.tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      ruc VARCHAR(11) UNIQUE NOT NULL,
      razon_social TEXT NOT NULL,
      nombre_comercial TEXT NOT NULL,
      rubro TEXT NOT NULL,
      palabras_clave TEXT[] NOT NULL DEFAULT '{}',
      whatsapp_destino TEXT NOT NULL DEFAULT '51924464410',
      alertas_activas BOOLEAN NOT NULL DEFAULT true,
      plan TEXT NOT NULL DEFAULT 'PILOTO_FUNDADOR',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- 2. Licitaciones Auditadas Table
    CREATE TABLE IF NOT EXISTS public.licitaciones_auditadas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
      nomenclatura TEXT NOT NULL,
      entidad TEXT NOT NULL,
      objeto TEXT NOT NULL,
      monto_pen NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
      score_viabilidad INTEGER NOT NULL DEFAULT 0,
      dictamen VARCHAR(20) NOT NULL CHECK (dictamen IN ('VIABLE', 'SUBSANABLE', 'NO_VIABLE')),
      penalidades_criticas INTEGER NOT NULL DEFAULT 0,
      horas_ahorradas NUMERIC(5, 1) NOT NULL DEFAULT 18.5,
      pdf_cdn_url TEXT NOT NULL,
      detalles JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
    CREATE INDEX IF NOT EXISTS idx_licitaciones_tenant_id ON public.licitaciones_auditadas(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_licitaciones_created_at ON public.licitaciones_auditadas(created_at DESC);
  `;

  await runSql(schemaSql, 'Create Tables and Indexes');

  const seedSql = `
    -- Insert Tenants
    INSERT INTO public.tenants (slug, ruc, razon_social, nombre_comercial, rubro, palabras_clave, whatsapp_destino, plan)
    VALUES 
    (
      'consorcio-medico',
      '20608945123',
      'Consorcio Médico del Norte S.A.C.',
      'Consorcio Médico del Norte',
      'Salud & Diagnóstico por Imágenes',
      ARRAY['tomografia', 'resonancia', 'rayos x', 'essalud', 'minsa', 'biomedico'],
      '51924464410',
      'PILOTO_FUNDADOR'
    ),
    (
      'the-quant-partners',
      '20100100101',
      'The Quant Partners S.A.C.',
      'The Quant Partners',
      'Tecnología, IA & Auditoría Legal',
      ARRAY['software', 'ia', 'auditoria', 'consultoria', 'seace'],
      '51924464410',
      'ENTERPRISE_INTERNAL'
    )
    ON CONFLICT (slug) DO UPDATE SET
      whatsapp_destino = EXCLUDED.whatsapp_destino,
      updated_at = now();

    -- Clear existing test licitaciones for clean seed
    DELETE FROM public.licitaciones_auditadas WHERE tenant_id IN (SELECT id FROM public.tenants WHERE slug = 'consorcio-medico');

    -- Insert Real & Benchmarking Audited Tenders for Consorcio Médico
    INSERT INTO public.licitaciones_auditadas 
    (tenant_id, nomenclatura, entidad, objeto, monto_pen, score_viabilidad, dictamen, penalidades_criticas, horas_ahorradas, pdf_cdn_url, detalles, created_at)
    VALUES
    (
      (SELECT id FROM public.tenants WHERE slug = 'consorcio-medico'),
      'CP SER-SM-3-2026-ESSALUD/RAPI-1',
      'EsSalud Piura - Red Asistencial Piura',
      'Contratación del Servicio de Tomografía Espiral Multicorte para el Hospital III José Cayetano Heredia',
      2850000.00,
      75,
      'SUBSANABLE',
      8,
      18.5,
      'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf',
      '{"penalidades": ["Mora 10% contrato", "Inasistencia especialista 5% UIT/día", "Acreditación capital de trabajo 2x", "Póliza SCTR y Responsabilidad Civil $500k"], "rtm_cumplidos": 11, "rtm_totales": 11, "evaluacion": "Factores de evaluación ponderan tiempo de entrega y mejoras tecnológicas"}',
      now() - interval '2 hours'
    ),
    (
      (SELECT id FROM public.tenants WHERE slug = 'consorcio-medico'),
      'AS-SM-12-2026-MINSA-1',
      'Hospital Nacional Dos de Mayo - MINSA',
      'Adquisición de Equipos de Radiografía Digital Rodable de Alta Resolución',
      1420000.00,
      92,
      'VIABLE',
      3,
      16.0,
      'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf',
      '{"penalidades": ["Mora estándar", "Demora en entrega repuestos 1% UIT"], "rtm_cumplidos": 14, "rtm_totales": 14, "evaluacion": "Condiciones óptimas sin cláusulas viciadas"}',
      now() - interval '1 day'
    ),
    (
      (SELECT id FROM public.tenants WHERE slug = 'consorcio-medico'),
      'LP-SM-1-2026-DIRIS-LS-1',
      'DIRIS Lima Sur - Red Integrada de Salud',
      'Mantenimiento Preventivo y Correctivo Integral de Tomógrafos y Resonadores',
      890000.00,
      45,
      'NO_VIABLE',
      12,
      21.0,
      'https://lovlsbjxzeiukygwpuvp.supabase.co/storage/v1/object/public/reportes-periciales/Auditoria_CP_SER-SM-3-2026-ESSALUD_RAPI-1.pdf',
      '{"penalidades": ["Penalidad desproporcionada por parada no programada 15% UIT/hora", "Experiencia de personal direccionada a marca única", "Retención indebida en fondo de garantía"], "rtm_cumplidos": 6, "rtm_totales": 15, "evaluacion": "Alto riesgo de descalificación por RTM direccionado"}',
      now() - interval '2 days'
    );
  `;

  await runSql(seedSql, 'Seed Tenants and Audited Tenders');
  console.log('🎉 Multi-tenant database initialization and seeding completed successfully!');
}

main().catch(console.error);
