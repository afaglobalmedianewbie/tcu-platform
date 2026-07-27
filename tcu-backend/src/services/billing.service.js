/**
 * @file billing.service.js
 * @description Service layer untuk logika bisnis domain Billing & Invoices
 */
const { prisma, generateId } = require('../utils/helpers');

class BillingService {
  async getInvoices() {
    return prisma.invoice.findMany({
      include: { customer: { select: { full_name: true, customer_id_string: true } } },
      orderBy: { created_at: 'desc' }
    });
  }

  async generateMassInvoices() {
    const activeCustomers = await prisma.customerProfile.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true }
    });

    const now = new Date();
    const period = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 10);

    const invoices = await Promise.all(activeCustomers.map(c =>
      prisma.invoice.create({
        data: {
          id: generateId('INV'),
          customerId: c.id,
          period,
          amount: c.plan.price,
          due_date: dueDate,
        }
      })
    ));

    return { period, count: invoices.length, invoices };
  }
}

module.exports = new BillingService();
