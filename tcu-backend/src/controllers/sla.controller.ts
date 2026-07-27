import { Request, Response } from 'express';
import { SlaService } from '../services/sla.service';

const slaService = new SlaService();

export class SlaController {
  
  static async getTicketSla(req: Request, res: Response) {
    try {
      const { ticket_id } = req.params;
      const data = await slaService.getTicketSla(ticket_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getWorkOrderSla(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await slaService.getWorkOrderSla(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await slaService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async evaluate(req: Request, res: Response) {
    try {
      // In production, this might be triggered by a Cron Job, not a public endpoint
      // Ensure strict RBAC (Super Admin or System Cron only)
      const data = await slaService.evaluateSlas();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updatePolicy(req: Request, res: Response) {
    try {
      const result = await slaService.updatePolicy(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
