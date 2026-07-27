import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoring.service';

const monitoringService = new MonitoringService();

export class MonitoringController {
  
  static async getOltOnu(req: Request, res: Response) {
    try {
      const { olt_id } = req.params;
      const data = await monitoringService.getOltOnu(olt_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOltStatus(req: Request, res: Response) {
    try {
      const { olt_id } = req.params;
      const data = await monitoringService.getOltStatus(olt_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPppoeSessions(req: Request, res: Response) {
    try {
      const data = await monitoringService.getPppoeSessions();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const data = await monitoringService.getLogs(limit);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await monitoringService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
