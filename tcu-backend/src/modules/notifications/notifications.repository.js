const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationRepository {
  async createLog(data) {
    // Mencetak riwayat PENDING sebelum masuk ke jaringan Redis.
    // return prisma.notificationLog.create({ data: { ...data, status: 'PENDING' } });
    return { id: 'notif-uuid-placeholder', status: 'PENDING', ...data };
  }

  async updateDeliveryStatus(id, status, errorDetails = null) {
    // 6. Penjejak presisi status pengiriman (Delivered/Failed).
    // return prisma.notificationLog.update({ where: { id }, data: { status, errorDetails } });
    return { id, status, errorDetails };
  }

  async findLogsByCustomer(customerId, skip, take) {
    // return prisma.notificationLog.findMany({ where: { customerId }, skip, take });
    return [];
  }
}

module.exports = new NotificationRepository();
