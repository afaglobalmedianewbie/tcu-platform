/**
 * @file ticket.service.js
 * @description Service layer untuk logika bisnis domain Ticket & Work Order
 */
const { prisma, generateId } = require('../utils/helpers');

class TicketService {
  async getTickets() {
    return prisma.ticket.findMany({
      include: { customer: { select: { full_name: true, customer_id_string: true } } },
      orderBy: { created_at: 'desc' }
    });
  }

  async assignTicket(ticketId, status) {
    return prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });
  }

  async getWorkOrders() {
    return prisma.workOrder.findMany({
      include: {
        technician: { select: { email: true } },
        customer: { select: { full_name: true, customer_id_string: true, address: true } },
        ticket: { select: { subject: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async createWorkOrder({ technicianId, customerId, ticketId, task_type, scheduled }) {
    return prisma.workOrder.create({
      data: {
        id: generateId('WO'),
        technicianId,
        customerId,
        ticketId: ticketId || null,
        task_type: task_type || 'NEW_INSTALLATION',
        scheduled: new Date(scheduled),
      }
    });
  }
}

module.exports = new TicketService();
