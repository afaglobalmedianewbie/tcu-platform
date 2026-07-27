import { Request, Response } from 'express';
import { DrService } from '../services/dr.service';

const drService = new DrService();

export class DrController {

  static async getStatus(req: Request, res: Response) {
    try {
      const data = await drService.getStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getReplicationStatus(req: Request, res: Response) {
    try {
      const data = await drService.getReplicationStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async activateFailover(req: Request, res: Response) {
    try {
      const { reason } = req.body;
      const userId = (req as any).user?.id || 'sys';
      const result = await drService.activateFailover(userId, reason);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async testFailover(req: Request, res: Response) {
    try {
      const { scenario } = req.body;
      const userId = (req as any).user?.id || 'sys';
      const result = await drService.testFailoverScenario(scenario, userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const data = await drService.getLogs();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
