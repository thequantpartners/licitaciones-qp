import dotenv from 'dotenv';
dotenv.config();

import { WhatsAppDispatcher } from '../src/dispatchers/whatsapp_baileys';

async function sendTest() {
  await WhatsAppDispatcher.inicializar();
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (WhatsAppDispatcher.estaConectado()) break;
  }

  const sock = (WhatsAppDispatcher as any).sock;
  if (!sock) {
    console.error('Sock is null');
    process.exit(1);
  }

  console.log('Testing sending text to 51902105668...');
  try {
    const res = await sock.sendMessage('51902105668@s.whatsapp.net', {
      text: '🏛️ *Prueba Directa Licitaciones QP*\nHola Kenneth, prueba de conectividad exitosa.'
    });
    console.log('Result from sendMessage:', res);
  } catch (err: any) {
    console.error('Error in sendMessage:', err);
  }

  await new Promise(r => setTimeout(r, 3000));
  process.exit(0);
}

sendTest().catch(console.error);
