import dotenv from 'dotenv';
import { WhatsAppDispatcher } from './whatsapp_baileys.js';
dotenv.config();

export interface AlertNotification {
  nomenclatura: string;
  entidad: string;
  objeto: string;
  valorReferencial: number;
  scoreViabilidad: number;
  hallazgosCriticos: string[];
  pdfUrl: string;
  pdfLocalPath?: string;
}

export class NotifierWebhook {
  /**
   * Envía una notificación instantánea al fundador con los hallazgos de la auditoría y el PDF adjunto
   */
  static async despacharAlerta(alerta: AlertNotification): Promise<void> {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const alertWebhookUrl = process.env.ALERT_WEBHOOK_URL;

    const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const mensajeHtml = `🚨 <b>LICITACIONES QP | NUEVA AUDITORÍA COMPLETADA</b>\n\n` +
      `🏛️ <b>Entidad:</b> ${escapeHtml(alerta.entidad)}\n` +
      `📑 <b>Proceso:</b> <code>${escapeHtml(alerta.nomenclatura)}</code>\n` +
      `💰 <b>Monto Estimado:</b> S/. ${alerta.valorReferencial.toLocaleString('es-PE')}\n` +
      `🎯 <b>Score de Viabilidad:</b> ${alerta.scoreViabilidad}%\n\n` +
      `⚠️ <b>Alertas Críticas Detectadas:</b>\n${alerta.hallazgosCriticos.map(h => `• ${escapeHtml(h)}`).join('\n')}\n\n` +
      `<i>💡 Toca el botón inferior para revisar el Informe Pericial A4.</i>`;

    console.log('[Notifier] Notificación estructurada lista:');
    console.log(mensajeHtml);

    // 1. Envío a Telegram Bot (si está configurado)
    if (telegramBotToken && telegramChatId) {
      try {
        console.log('[Notifier] Enviando alerta limpia a Telegram...');
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: mensajeHtml,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '📄 Abrir Informe Pericial A4 (CDN)',
                    url: alerta.pdfUrl
                  }
                ]
              ]
            }
          })
        });
        if (res.ok) {
          console.log('✅ [Notifier] Alerta enviada con éxito a Telegram!');
        } else {
          console.warn('[Notifier] Error enviando alerta a Telegram:', await res.text());
        }
      } catch (err: any) {
        console.error('[Notifier] Fallo de conexión con Telegram:', err.message);
      }
    }

    // 2. Envío a Webhook genérico (si está configurado)
    if (alertWebhookUrl) {
      try {
        console.log('[Notifier] Despachando a Webhook configurado...');
        await fetch(alertWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'audit_completed',
            timestamp: new Date().toISOString(),
            data: alerta,
            formattedMessage: mensajeHtml
          })
        });
        console.log('✅ [Notifier] Webhook despachado con éxito.');
      } catch (err: any) {
        console.error('[Notifier] Fallo despachando Webhook:', err.message);
      }
    }

    // 3. Envío a WhatsApp (si está configurado y conectado)
    const whatsappTargets = (process.env.WHATSAPP_TARGET_NUMBERS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (whatsappTargets.length > 0 && WhatsAppDispatcher.estaConectado()) {
      const mensajeWhatsApp = `🚨 *LICITACIONES QP | AUDITORÍA PERICIAL COMPLETADA*\n\n` +
        `🏛️ *Entidad:* ${alerta.entidad}\n` +
        `📑 *Proceso:* ${alerta.nomenclatura}\n` +
        `💰 *Monto Estimado:* S/. ${alerta.valorReferencial.toLocaleString('es-PE')}\n` +
        `🎯 *Score de Viabilidad:* ${alerta.scoreViabilidad}%\n\n` +
        `⚠️ *Alertas Críticas Detectadas:*\n${alerta.hallazgosCriticos.map(h => `• ${h}`).join('\n')}\n\n` +
        `📄 *Descargar Informe Pericial A4 (CDN):*\n${alerta.pdfUrl}\n\n` +
        `_Licitaciones QP Engine • Auditoría Determinista_`;

      for (const target of whatsappTargets) {
        await WhatsAppDispatcher.enviarAlerta(target, mensajeWhatsApp);
      }
    }
  }
}
