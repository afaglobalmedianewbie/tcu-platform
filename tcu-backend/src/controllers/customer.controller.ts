import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';

const customerService = new CustomerService();

export class CustomerController {
  
  static async getDashboard(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await customerService.getDashboardData(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getBilling(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await customerService.getCustomerBilling(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getInvoiceDetail(req: Request, res: Response) {
    try {
      const { invoice_id } = req.params;
      const data = await customerService.getInvoiceDetail(invoice_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTickets(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await customerService.getCustomerTickets(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createTicket(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const result = await customerService.createTicket(customerId, req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const result = await customerService.updateProfile(customerId, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      // Equivalent to fetching just the internetStatus block from Dashboard Data
      const customerId = (req as any).user?.id || 'cust1';
      const dashboard = await customerService.getDashboardData(customerId);
      res.json({ success: true, data: dashboard.internetStatus });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
