import dotenv from 'dotenv';
dotenv.config();

import { WhatsAppDispatcher } from '../src/dispatchers/whatsapp_baileys';

async function check() {
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

  const numbers = ['51902105668', '51924464410'];
  for (const num of numbers) {
    try {
      console.log(`Checking if ${num} is on WhatsApp...`);
      const results = await sock.onWhatsApp(num);
      console.log(`Result for ${num}:`, results);
    } catch (e: any) {
      console.error(`Error checking ${num}:`, e.message);
    }
  }

  process.exit(0);
}

check().catch(console.error);
