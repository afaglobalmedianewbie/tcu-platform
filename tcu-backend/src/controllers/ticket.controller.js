/**
 * @file ticket.controller.js
 * @description Controller untuk mengelola rute domain Ticket & Work Order (Consolidated)
 */
const ticketService = require('../services/ticket.service');
const auditService = require('../core/audit/audit.service');

class TicketController {
  // GET /api/admin/tickets
  async getTickets(req, res, next) {
    try {
      const tickets = await ticketService.getTickets();
      await auditService.auditTicketAction(req, 'TICKETS_VIEWED', 'SUCCESS');
      res.json({ success: true, tickets });
    } catch (err) {
      await auditService.auditTicketAction(req, 'TICKETS_VIEWED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // PATCH /api/admin/tickets/:id
  async assignTicket(req, res, next) {
    const { status } = req.body;
    const { id } = req.params;
    try {
      const ticket = await ticketService.assignTicket(id, status);
      await auditService.auditTicketAction(req, 'TICKET_ASSIGNED', 'SUCCESS', { targetId: id, status });
      res.json({ success: true, message: 'Status tiket diperbarui.', ticket });
    } catch (err) {
      await auditService.auditTicketAction(req, 'TICKET_ASSIGNED', 'FAIL', { targetId: id, error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/admin/work-orders
  async getWorkOrders(req, res, next) {
    try {
      const workOrders = await ticketService.getWorkOrders();
      await auditService.auditTicketAction(req, 'WORK_ORDERS_VIEWED', 'SUCCESS');
      res.json({ success: true, workOrders });
    } catch (err) {
      await auditService.auditTicketAction(req, 'WORK_ORDERS_VIEWED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/admin/work-orders
  async createWorkOrder(req, res, next) {
    const { technicianId, customerId, ticketId, task_type, scheduled } = req.body;
    try {
      const wo = await ticketService.createWorkOrder({ technicianId, customerId, ticketId, task_type, scheduled });
      await auditService.auditTicketAction(req, 'WORK_ORDER_CREATED', 'SUCCESS', { targetId: wo.id });
      res.status(201).json({ success: true, message: 'Work Order berhasil dibuat.', workOrder: wo });
    } catch (err) {
      await auditService.auditTicketAction(req, 'WORK_ORDER_CREATED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new TicketController();
