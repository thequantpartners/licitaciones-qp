import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'lovlsbjxzeiukygwpuvp';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('Falta variable SUPABASE_ACCESS_TOKEN en .env');
  process.exit(1);
}

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
  try {
    console.log('Response:', JSON.parse(text));
  } catch {
    console.log('Response text:', text);
  }
}

runSql('SELECT current_database(), version();');
