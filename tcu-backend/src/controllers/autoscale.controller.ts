import { Request, Response } from 'express';
import { AutoscaleService } from '../services/autoscale.service';

const autoscaleService = new AutoscaleService();

export class AutoscaleController {

  static async getNodes(req: Request, res: Response) {
    try {
      const data = await autoscaleService.getNodes();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async addNode(req: Request, res: Response) {
    try {
      const { ipAddress, port } = req.body;
      const data = await autoscaleService.addNode(ipAddress, port);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async removeNode(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await autoscaleService.removeNode(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getHealth(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await autoscaleService.getNodeHealth(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async rebalance(req: Request, res: Response) {
    try {
      const result = await autoscaleService.rebalance();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMetrics(req: Request, res: Response) {
    try {
      const data = await autoscaleService.getMetrics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
