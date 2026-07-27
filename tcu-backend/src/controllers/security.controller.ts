import { Request, Response } from 'express';
import { SecurityService } from '../services/security.service';

const securityService = new SecurityService();

export class SecurityController {
  
  static async getThreats(req: Request, res: Response) {
    try {
      const data = await securityService.getActiveThreats();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getThreat(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await securityService.getThreat(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async scanNetwork(req: Request, res: Response) {
    try {
      const result = await securityService.scanNetwork();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async scanCustomer(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const result = await securityService.scanCustomer(customer_id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async blockFirewall(req: Request, res: Response) {
    try {
      const { type, value, reason } = req.body;
      const result = await securityService.blockEntity(type, value, reason);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async unblockFirewall(req: Request, res: Response) {
    try {
      const { type, value } = req.body;
      const result = await securityService.unblockEntity(type, value);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const data = await securityService.getLogs();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
