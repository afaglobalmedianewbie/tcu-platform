import { Ticket, TicketLog, TicketAttachment } from '../models/ticket.model';

export class TicketService {
  
  async createTicket(payload: { customerId: string; category: any; description: string; priority: any }, creatorId: string) {
    const ticketId = `TKT-${Date.now()}`;
    
    // SLA definition based on priority
    let slaTimerMinutes = 120; // Default 2 hours for MEDIUM
    if (payload.priority === 'HIGH') slaTimerMinutes = 60; // 1 hour
    if (payload.priority === 'LOW') slaTimerMinutes = 1440; // 24 hours

    const ticket: Ticket = {
      id: ticketId,
      customerId: payload.customerId,
      category: payload.category,
      description: payload.description,
      priority: payload.priority,
      status: 'OPEN',
      slaTimerMinutes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save ticket to DB (Simulated)
    console.log(`[Ticket] Created ${ticketId} by ${creatorId}`);

    // Create log (Simulated)
    return ticket;
  }

  async getTicket(ticketId: string) {
    // Retrieve ticket, logs, attachments from DB (Simulated)
    return {
      id: ticketId,
      status: 'OPEN',
      logs: [],
      attachments: []
    };
  }

  async getTicketsByCustomer(customerId: string) {
    // Retrieve tickets from DB (Simulated)
    return [
      { id: `TKT-${Date.now()}`, customerId, status: 'OPEN', category: 'INTERNET_DOWN' }
    ];
  }

  async getTicketList(status?: string) {
    // Retrieve tickets filtered by status from DB (Simulated)
    return [
      { id: `TKT-123`, status: 'OPEN' },
      { id: `TKT-124`, status: 'PROGRESS' }
    ].filter(t => !status || t.status === status.toUpperCase());
  }

  async updateTicketNotes(ticketId: string, userId: string, notes: string) {
    // Append customer/technician chat notes to TicketLog (Simulated)
    console.log(`[Ticket] User ${userId} added notes to ${ticketId}`);
    return { success: true };
  }

  async uploadCustomerPhoto(ticketId: string, customerId: string, fileUrl: string) {
    // Save to TicketAttachment DB (Simulated)
    return { success: true, fileUrl };
  }

  async closeTicket(ticketId: string, userId: string, resolutionNotes: string) {
    // 1. Update ticket status to CLOSED
    // 2. Add log
    console.log(`[Ticket] ${ticketId} closed by ${userId}`);
    return { success: true, message: 'Ticket closed' };
  }
}
