import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  Browsers
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class WhatsAppDispatcher {
  private static sock: WASocket | null = null;
  private static isReady: boolean = false;
  private static isInitializing: boolean = false;
  private static authDir: string = path.resolve(process.env.STORAGE_DIR || './storage', 'whatsapp_auth');

  /**
   * Inicializa la conexión con WhatsApp mediante Baileys y persiste las credenciales
   */
  static async inicializar(): Promise<void> {
    if (this.sock && this.isReady) return;
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      if (this.sock) {
        try {
          this.sock.ev.removeAllListeners('connection.update');
          this.sock.ev.removeAllListeners('creds.update');
          (this.sock as any).ws?.close();
        } catch {}
        this.sock = null;
      }

      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const storageDir = path.resolve(process.env.STORAGE_DIR || './storage');
      const tarFile = path.join(storageDir, 'whatsapp_auth.tar.gz');
      const credsFile = path.join(this.authDir, 'creds.json');

      if (fs.existsSync(tarFile) && !fs.existsSync(credsFile)) {
        try {
          console.log('[WhatsApp] Descomprimiendo sesión respaldada desde whatsapp_auth.tar.gz...');
          const { execSync } = await import('child_process');
          execSync(`tar -xzf "${tarFile}" -C "${storageDir}"`);
          console.log('✅ [WhatsApp] Sesión restaurada con éxito desde tar.gz!');
        } catch (err: any) {
          console.error('[WhatsApp] Error descomprimiendo backup de sesión:', err.message);
        }
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: false,
        markOnlineOnConnect: false
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('\n================================================================');
          console.log('📲 LICITACIONES QP | ESCANEA ESTE CÓDIGO QR CON WHATSAPP:');
          console.log('================================================================');
          qrcode.generate(qr, { small: true });
          console.log('Abre WhatsApp en tu teléfono > Dispositivos vinculados > Vincular dispositivo');
          console.log('================================================================\n');

          try {
            const qrPngPath = path.resolve('./storage/whatsapp_qr.png');
            await QRCode.toFile(qrPngPath, qr, { width: 500, margin: 3 });
            const artifactQrPath = 'C:\\Users\\Ken Ryzen\\.gemini\\antigravity\\brain\\a9a574e2-e727-4074-949b-0a53d4a84f04\\whatsapp_qr.png';
            fs.copyFileSync(qrPngPath, artifactQrPath);
            fs.writeFileSync(path.resolve('./storage/whatsapp_qr.txt'), qr);
            console.log(`[WhatsApp] Código QR guardado en: ${qrPngPath}`);

            if (process.platform === 'win32') {
              const { exec } = require('child_process');
              exec(`start "" "${qrPngPath}"`);
              console.log('✅ [WhatsApp] Ventana emergente con el código QR abierta en tu pantalla.');
            }
          } catch (qrErr: any) {
            console.error('[WhatsApp] Error guardando QR en imagen:', qrErr.message);
          }
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const errorMsg = (lastDisconnect?.error as Error)?.message;
          console.log(`[WhatsApp] Conexión cerrada. Código: ${statusCode}, Detalle: ${errorMsg}`);
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          console.log('[WhatsApp] Reconectando?:', shouldReconnect);
          this.isReady = false;
          if (shouldReconnect) {
            setTimeout(() => this.inicializar(), 5000);
          }
        } else if (connection === 'open') {
          console.log('✅ [WhatsApp] Conexión establecida con éxito! Dispositivo enlazado y listo.');
          this.isReady = true;

          try {
            const { exec } = await import('child_process');
            const sDir = path.resolve(process.env.STORAGE_DIR || './storage');
            exec(`tar -czf "${path.join(sDir, 'whatsapp_auth.tar.gz')}" -C "${sDir}" whatsapp_auth`);
          } catch {
            // Ignorar
          }
        }
      });
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Despacha un mensaje de auditoría a uno o varios números de WhatsApp
   */
  static async enviarAlerta(
    telefono: string,
    mensaje: string
  ): Promise<boolean> {
    if (!this.sock || !this.isReady) {
      console.warn('[WhatsApp] El servicio no está autenticado o listo para enviar.');
      return false;
    }

    try {
      const limpio = telefono.replace(/[^0-9]/g, '');
      const jid = `${limpio}@s.whatsapp.net`;

      // Verificar si el número existe en WhatsApp antes de enviar
      try {
        const results = await this.sock.onWhatsApp(jid);
        const onWa = results?.[0];
        if (!onWa || !onWa.exists) {
          console.warn(`⚠️ [WhatsApp] El número ${limpio} NO está registrado en WhatsApp.`);
          return false;
        }
      } catch (checkErr: any) {
        console.warn(`[WhatsApp] Advertencia en check onWhatsApp para ${limpio}:`, checkErr.message);
      }

      console.log(`[WhatsApp] Enviando mensaje pericial a: ${limpio}...`);
      await this.sock.sendMessage(jid, { text: mensaje });
      console.log(`✅ [WhatsApp] Mensaje entregado con éxito a ${limpio}!`);
      return true;
    } catch (err: any) {
      console.error(`[WhatsApp] Error enviando mensaje a ${telefono}:`, err.message);
      return false;
    }
  }

  /**
   * Estado actual de la conexión
   */
  static estaConectado(): boolean {
    return this.isReady;
  }
}

