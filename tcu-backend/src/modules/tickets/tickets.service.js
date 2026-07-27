const ticketRepo = require('./tickets.repository');
const { HttpError } = require('../../core/http/http-error');

class TicketService {
  async getAllTickets(skip, take) {
    return await ticketRepo.findAll(skip, take);
  }

  async getTicketById(id) {
    const ticket = await ticketRepo.findById(id);
    if (!ticket) throw new HttpError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    return ticket;
  }

  async createTicket(data) {
    return await ticketRepo.create(data);
  }

  async updateTicket(id, data) {
    const exists = await ticketRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    return await ticketRepo.update(id, data);
  }

  async assignTicket(id, assigneeId) {
    const exists = await ticketRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    return await ticketRepo.assign(id, assigneeId);
  }

  async closeTicket(id) {
    const exists = await ticketRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    return await ticketRepo.updateStatus(id, 'CLOSED');
  }

  async reopenTicket(id) {
    const exists = await ticketRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    return await ticketRepo.updateStatus(id, 'OPEN');
  }
}

module.exports = new TicketService();
