import { SendNotificationPayload, NotificationLog } from '../models/notification.model';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';
import { TelegramService } from './telegram.service';

export class NotificationService {
  private emailService = new EmailService();
  private waService = new WhatsAppService();
  private tgService = new TelegramService();

  async sendEmail(payload: SendNotificationPayload) {
    if (!payload.email) throw new Error('Email address is required');
    const result = await this.emailService.sendEmail(payload.email, payload.title, payload.body);
    await this.logNotification('EMAIL', payload, result.success ? 'SENT' : 'FAILED');
    return result;
  }

  async sendWhatsApp(payload: SendNotificationPayload) {
    if (!payload.phone) throw new Error('Phone number is required');
    const result = await this.waService.sendMessage(payload.phone, `*${payload.title}*\\n\\n${payload.body}`);
    await this.logNotification('WHATSAPP', payload, result.success ? 'SENT' : 'FAILED');
    return result;
  }

  async sendTelegram(payload: SendNotificationPayload) {
    if (!payload.telegramChatId) throw new Error('Telegram Chat ID is required');
    const result = await this.tgService.sendMessage(payload.telegramChatId, `<b>${payload.title}</b>\\n\\n${payload.body}`);
    await this.logNotification('TELEGRAM', payload, result.success ? 'SENT' : 'FAILED');
    return result;
  }

  async sendBroadcast(payload: SendNotificationPayload & { channels: string[] }) {
    const results = [];
    if (payload.channels.includes('EMAIL') && payload.email) {
      results.push(await this.sendEmail(payload));
    }
    if (payload.channels.includes('WHATSAPP') && payload.phone) {
      results.push(await this.sendWhatsApp(payload));
    }
    if (payload.channels.includes('TELEGRAM') && payload.telegramChatId) {
      results.push(await this.sendTelegram(payload));
    }
    return { success: true, channelsNotified: results.length };
  }

  async getLogs(limit: number = 50) {
    // Simulated DB fetch
    return [
      { id: '1', type: 'BILLING_CREATED', channel: 'WHATSAPP', status: 'SENT', sentAt: new Date() },
      { id: '2', type: 'ONU_OFFLINE', channel: 'TELEGRAM', status: 'SENT', sentAt: new Date() },
      { id: '3', type: 'TICKET_UPDATED', channel: 'EMAIL', status: 'SENT', sentAt: new Date() },
    ];
  }

  private async logNotification(channel: 'EMAIL'|'WHATSAPP'|'TELEGRAM'|'BROADCAST', payload: SendNotificationPayload, status: 'SENT'|'FAILED') {
    const log: NotificationLog = {
      id: `notif_${Date.now()}`,
      customerId: payload.customerId,
      type: payload.metadata?.type || 'GENERAL',
      channel,
      title: payload.title,
      body: payload.body,
      status,
      sentAt: new Date()
    };
    // Save to DB (Simulated)
    console.log(`[NotificationLog] Saved log for ${channel} -> ${status}`);
  }
}
