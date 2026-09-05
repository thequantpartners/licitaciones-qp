import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data, error } = await client.from('alertas_despacho').select('*').order('created_at', { ascending: false }).limit(2);
  console.log('Queued rows:', data?.length);
  if (data && data.length > 0) {
    console.log('Latest row:', {
      id: data[0].id,
      telefono: data[0].telefono,
      tipo: data[0].tipo,
      consentimiento: data[0].consentimiento_ley29733,
      estado: data[0].estado,
      created_at: data[0].created_at
    });
  }
}

check();
