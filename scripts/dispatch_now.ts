import dotenv from 'dotenv';
dotenv.config();

import { WhatsAppDispatcher } from '../src/dispatchers/whatsapp_baileys';
import { SupabaseDatabase } from '../src/database/supabase_db';

async function dispatchPendingQueue() {
  console.log('🚀 Iniciando despachador de cola Supabase -> Baileys...');
  await WhatsAppDispatcher.inicializar();

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (WhatsAppDispatcher.estaConectado()) {
      console.log('✅ Baileys autenticado y listo');
      break;
    }
  }

  if (!WhatsAppDispatcher.estaConectado()) {
    console.error('❌ Error: WhatsApp no conectado.');
    process.exit(1);
  }

  const client = SupabaseDatabase.getClient();
  if (!client) {
    console.error('❌ Error: Supabase client no inicializado.');
    process.exit(1);
  }

  const { data: pending, error } = await client
    .from('alertas_despacho')
    .select('*')
    .eq('estado', 'PENDIENTE');

  if (error) {
    console.error('❌ Error consultando Supabase:', error);
    process.exit(1);
  }

  console.log(`📋 Alertas pendientes a procesar: ${pending?.length || 0}`);

  if (pending && pending.length > 0) {
    for (const item of pending) {
      console.log(`\n⏳ Despachando demo a ${item.telefono}...`);
      
      // Si el número es 51987654321 (número de prueba ficticio), marcar como ignorado o enviar
      if (item.telefono === '51987654321') {
        console.log('⏭️ Saltando número ficticio de prueba 51987654321...');
        await client
          .from('alertas_despacho')
          .update({ estado: 'ENVIADO', sent_at: new Date().toISOString() })
          .eq('id', item.id);
        continue;
      }

      const exito = await WhatsAppDispatcher.enviarAlerta(item.telefono, item.mensaje);
      if (exito) {
        await client
          .from('alertas_despacho')
          .update({ estado: 'ENVIADO', sent_at: new Date().toISOString() })
          .eq('id', item.id);
        console.log(`🎯 ¡ÉXITO! Dictamen pericial entregado a ${item.telefono}`);
      } else {
        console.error(`❌ No se pudo entregar a ${item.telefono}`);
      }

      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n✨ Cola procesada completamente.');
  await new Promise(r => setTimeout(r, 2000));
  process.exit(0);
}

dispatchPendingQueue().catch(console.error);
