const ticketService = require('./tickets.service');
const { sendSuccess } = require('../../core/http/api-response');
const { logAudit } = require('../../core/audit/audit-logger');

const getTickets = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const data = await ticketService.getAllTickets(skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

const getTicketById = async (req, res) => {
  const data = await ticketService.getTicketById(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

const createTicket = async (req, res) => {
  const data = await ticketService.createTicket(req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: data.id,
    targetType: 'Ticket',
    action: 'TICKET_CREATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 201, 'Ticket created', data);
};

const updateTicket = async (req, res) => {
  const data = await ticketService.updateTicket(req.params.id, req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Ticket',
    action: 'TICKET_UPDATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Ticket updated', data);
};

const assignTicket = async (req, res) => {
  const data = await ticketService.assignTicket(req.params.id, req.body.assigneeId);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Ticket',
    action: 'TICKET_ASSIGNED',
    metadata: { assigneeId: req.body.assigneeId },
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Ticket assigned', data);
};

const closeTicket = async (req, res) => {
  const data = await ticketService.closeTicket(req.params.id);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Ticket',
    action: 'TICKET_CLOSED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Ticket closed', data);
};

const reopenTicket = async (req, res) => {
  const data = await ticketService.reopenTicket(req.params.id);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Ticket',
    action: 'TICKET_REOPENED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Ticket reopened', data);
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignTicket,
  closeTicket,
  reopenTicket
};
