import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase with URL:', url);
if (!url || !key) {
  console.error('Missing credentials');
  process.exit(1);
}

const client = createClient(url, key);

async function main() {
  try {
    const { data, error } = await client.from('tenants').select('*').limit(1);
    if (error) {
      console.log('Table "tenants" query result:', error.message, error.code);
    } else {
      console.log('Table "tenants" exists! Rows:', data?.length);
    }
  } catch (err: any) {
    console.error('Error querying:', err.message);
  }
}

main();
