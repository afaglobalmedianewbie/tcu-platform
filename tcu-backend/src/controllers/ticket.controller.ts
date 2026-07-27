import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { TechnicianService } from '../services/technician.service';

const ticketService = new TicketService();
const technicianService = new TechnicianService();

export class TicketController {
  
  static async createTicket(req: Request, res: Response) {
    try {
      const { customerId, category, description, priority } = req.body;
      const userId = (req as any).user?.id || 'guest';
      const ticket = await ticketService.createTicket({ customerId, category, description, priority }, userId);
      res.json({ success: true, data: ticket });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await ticketService.getTicket(id);
      res.json({ success: true, data: ticket });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTicketsByCustomer(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const tickets = await ticketService.getTicketsByCustomer(customer_id);
      res.json({ success: true, data: tickets });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTicketList(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const tickets = await ticketService.getTicketList(status as string);
      res.json({ success: true, data: tickets });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async assignTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { technicianId } = req.body;
      const assignedBy = (req as any).user?.id || 'admin';
      
      const result = await technicianService.assignTicket(id, technicianId, assignedBy);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes, status, fileUrl, isTechnician } = req.body;
      const userId = (req as any).user?.id || 'user';

      if (isTechnician && status) {
        // Technician updates sub-status
        await technicianService.updateWorkStatus(id, userId, status, notes);
      } else if (notes) {
        // General notes (customer chat or technician comment)
        await ticketService.updateTicketNotes(id, userId, notes);
      }
      
      if (fileUrl) {
        // Handle attachment
        if (isTechnician) {
          await technicianService.uploadWorkPhoto(id, userId, fileUrl);
        } else {
          await ticketService.uploadCustomerPhoto(id, userId, fileUrl);
        }
      }

      res.json({ success: true, message: 'Ticket updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async closeTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { resolutionNotes } = req.body;
      const userId = (req as any).user?.id || 'user';
      
      const result = await ticketService.closeTicket(id, userId, resolutionNotes);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
