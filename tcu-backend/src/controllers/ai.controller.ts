import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

const aiService = new AiService();

export class AiController {
  
  static async predictOnu(req: Request, res: Response) {
    try {
      const { onu_id } = req.params;
      const data = await aiService.predictOnu(onu_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async predictOlt(req: Request, res: Response) {
    try {
      const { olt_id } = req.params;
      const data = await aiService.predictOlt(olt_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async predictCustomer(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await aiService.predictCustomer(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await aiService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async trainModel(req: Request, res: Response) {
    try {
      const data = await aiService.trainModel();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async retrainModel(req: Request, res: Response) {
    try {
      const data = await aiService.retrainModel();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
