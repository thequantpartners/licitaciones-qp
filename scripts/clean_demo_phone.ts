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

  console.log('Status:', res.status);
}

runSql("UPDATE public.tenants SET whatsapp_destino = '' WHERE slug = 'consorcio-medico';");
