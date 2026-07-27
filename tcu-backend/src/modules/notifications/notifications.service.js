const notificationRepo = require('./notifications.repository');
const { addToQueue } = require('./notifications.queue');

class NotificationService {
  async queueNotification(customerId, type, channels, payload) {
    // Langkah 1: Buat status pengiriman berstatus 'PENDING'
    const log = await notificationRepo.createLog({ customerId, type, channels, payload });

    // Langkah 2: Lemparkan ke antrian Redis dengan toleransi jaringan terputus (attempts: 3)
    await addToQueue('PROCESS_NOTIFICATION', {
      notificationId: log.id,
      customerId,
      type,
      channels,
      payload
    }, { attempts: 3, backoff: 'exponential' });

    return log;
  }

  // Fungsi simulasi *Worker* Redis untuk konsumsi pesan (Belum aktif)
  async processNotificationPlaceholder(jobData) {
    const { notificationId, type, channels, payload } = jobData;
    
    for (const channel of channels) {
      if (channel === 'EMAIL') {
        // 3. Jangan meluncurkan pengiriman SMTP/Email sesungguhnya di masa kerangka.
        console.log(`[EMAIL_MOCK] Simulasi pengiriman Surel untuk event: ${type}`);
      } else if (channel === 'WHATSAPP') {
        // 2. Jangan menyenggol antarmuka API WhatsApp sesungguhnya.
        console.log(`[WA_MOCK] Simulasi pelemparan pesan instan WA untuk event: ${type}`);
      } else if (channel === 'PUSH') {
        console.log(`[PUSH_MOCK] Simulasi FCM Push Notification untuk event: ${type}`);
      } else if (channel === 'SYSTEM') {
        console.log(`[SYSTEM_MOCK] Simulasi UI web-bell untuk event: ${type}`);
      }
    }

    // Akhiri dengan menjejak status keberhasilan kirim
    await notificationRepo.updateDeliveryStatus(notificationId, 'DELIVERED');
  }

  async getCustomerNotifications(customerId, skip, take) {
    return await notificationRepo.findLogsByCustomer(customerId, skip, take);
  }
}

module.exports = new NotificationService();
