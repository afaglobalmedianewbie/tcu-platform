import { Request, Response } from 'express';
import { AiTrafficService } from '../services/ai_traffic.service';

const aiTrafficService = new AiTrafficService();

export class AiTrafficController {
  
  static async getOverview(req: Request, res: Response) {
    try {
      const data = await aiTrafficService.getOverview();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async predictCustomer(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await aiTrafficService.predictCustomerTraffic(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPppoeAnomalies(req: Request, res: Response) {
    try {
      const data = await aiTrafficService.getPppoeAnomalies();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async optimize(req: Request, res: Response) {
    try {
      const data = await aiTrafficService.runAutoOptimization();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async retrain(req: Request, res: Response) {
    try {
      const data = await aiTrafficService.retrainModel();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
