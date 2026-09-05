import dotenv from 'dotenv';
dotenv.config();

import { WhatsAppDispatcher } from '../src/dispatchers/whatsapp_baileys';
import { SupabaseDatabase } from '../src/database/supabase_db';

async function test() {
  console.log('[Test] Iniciando WhatsAppDispatcher...');
  await WhatsAppDispatcher.inicializar();

  console.log('[Test] Esperando conexión de WhatsApp...');
  // Esperar hasta 20 segundos a que isReady sea true
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (WhatsAppDispatcher.estaConectado()) {
      console.log('✅ [Test] WhatsAppDispatcher CONECTADO Y LISTO!');
      break;
    }
    console.log(`[Test] Esperando conexión... (${i + 1}s)`);
  }

  if (!WhatsAppDispatcher.estaConectado()) {
    console.error('❌ [Test] WhatsApp no se conectó a tiempo.');
    process.exit(1);
  }

  const client = SupabaseDatabase.getClient();
  if (!client) {
    console.error('❌ [Test] Supabase client no inicializado.');
    process.exit(1);
  }

  const { data: pending } = await client
    .from('alertas_despacho')
    .select('*')
    .eq('estado', 'PENDIENTE');

  console.log(`[Test] Alertas pendientes encontradas: ${pending?.length || 0}`);

  if (pending && pending.length > 0) {
    for (const item of pending) {
      console.log(`[Test] Enviando a ${item.telefono}...`);
      const sent = await WhatsAppDispatcher.enviarAlerta(item.telefono, item.mensaje);
      if (sent) {
        await client
          .from('alertas_despacho')
          .update({ estado: 'ENVIADO', sent_at: new Date().toISOString() })
          .eq('id', item.id);
        console.log(`✅ [Test] Encriptado y entregado a ${item.telefono}`);
      } else {
        console.error(`❌ [Test] Falló envío a ${item.telefono}`);
      }
    }
  }

  console.log('[Test] Finalizado con éxito.');
  process.exit(0);
}

test().catch(console.error);
