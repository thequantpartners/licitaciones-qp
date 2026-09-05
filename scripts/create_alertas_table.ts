import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'lovlsbjxzeiukygwpuvp';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function runSql(sql: string) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Result:', text);
}

const sql = `
  CREATE TABLE IF NOT EXISTS public.alertas_despacho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telefono TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'DEMO_ESSALUD',
    mensaje TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    consentimiento_ley29733 BOOLEAN NOT NULL DEFAULT true,
    ip_registro TEXT,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE',
    error_mensaje TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at TIMESTAMPTZ
  );

  CREATE INDEX IF NOT EXISTS idx_alertas_despacho_estado ON public.alertas_despacho(estado);
  CREATE INDEX IF NOT EXISTS idx_alertas_despacho_created ON public.alertas_despacho(created_at DESC);
`;

runSql(sql);
