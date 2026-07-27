import { Request, Response } from 'express';
import { MobileService } from '../services/mobile.service';
import { MobileAuthService } from '../services/mobile_auth.service';

const mobileService = new MobileService();
const mobileAuthService = new MobileAuthService();

export class MobileController {

  static async login(req: Request, res: Response) {
    try {
      const data = await mobileAuthService.login(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const data = await mobileAuthService.register(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getDashboard(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await mobileService.getDashboardData(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getBilling(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await mobileService.getBilling(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getInvoiceDetail(req: Request, res: Response) {
    try {
      const { invoice_id } = req.params;
      const data = await mobileService.getInvoiceDetail(invoice_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTickets(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await mobileService.getTickets(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createTicket(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const result = await mobileService.createTicket(customerId, req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await mobileService.getStatus(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getSpeedtestToken(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const data = await mobileService.getSpeedtestToken(customerId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id || 'cust1';
      const result = await mobileService.updateProfile(customerId, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
