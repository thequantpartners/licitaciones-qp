import dotenv from 'dotenv';
dotenv.config();

export interface AlertNotification {
  nomenclatura: string;
  entidad: string;
  objeto: string;
  valorReferencial: number;
  scoreViabilidad: number;
  hallazgosCriticos: string[];
  pdfUrl: string;
}

export class NotifierWebhook {
  private static telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  private static telegramChatId = process.env.TELEGRAM_CHAT_ID;
  private static alertWebhookUrl = process.env.ALERT_WEBHOOK_URL;

  /**
   * Envía una notificación instantánea al fundador con los hallazgos de la auditoría
   */
  static async despacharAlerta(alerta: AlertNotification): Promise<void> {
    const mensajeTexto = `🚨 *LICITACIONES QP | NUEVA AUDITORÍA COMPLETADA*\n\n` +
      `🏛️ *Entidad:* ${alerta.entidad}\n` +
      `📑 *Proceso:* \`${alerta.nomenclatura}\`\n` +
      `💰 *Monto Estimado:* S/. ${alerta.valorReferencial.toLocaleString('es-PE')}\n` +
      `🎯 *Score de Viabilidad:* ${alerta.scoreViabilidad}%\n\n` +
      `⚠️ *Alertas Críticas Detectadas:*\n${alerta.hallazgosCriticos.map(h => `• ${h}`).join('\n')}\n\n` +
      `📄 *Descargar Informe Pericial A4:*\n${alerta.pdfUrl}\n\n` +
      `_El "Caballo de Troya" está listo para prospección a postores._`;

    console.log('[Notifier] Notificación estructurada lista:');
    console.log(mensajeTexto);

    // 1. Envío a Telegram Bot (si está configurado)
    if (this.telegramBotToken && this.telegramChatId) {
      try {
        console.log('[Notifier] Enviando alerta a Telegram...');
        const res = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.telegramChatId,
            text: mensajeTexto,
            parse_mode: 'Markdown'
          })
        });
        if (res.ok) {
          console.log('✅ [Notifier] Alerta enviada con éxito a Telegram!');
        } else {
          console.warn('[Notifier] Error enviando a Telegram:', await res.text());
        }
      } catch (err: any) {
        console.error('[Notifier] Fallo de conexión con Telegram:', err.message);
      }
    }

    // 2. Envío a Webhook genérico (si está configurado)
    if (this.alertWebhookUrl) {
      try {
        console.log('[Notifier] Despachando a Webhook configurado...');
        await fetch(this.alertWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'audit_completed',
            timestamp: new Date().toISOString(),
            data: alerta,
            formattedMessage: mensajeTexto
          })
        });
        console.log('✅ [Notifier] Webhook despachado con éxito.');
      } catch (err: any) {
        console.error('[Notifier] Fallo despachando Webhook:', err.message);
      }
    }
  }
}
