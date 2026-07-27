import { Request, Response } from 'express';
import { FraudService } from '../services/fraud.service';

const fraudService = new FraudService();

export class FraudController {

  static async getScore(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await fraudService.getCustomerScore(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await fraudService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async evaluate(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const result = await fraudService.evaluateCustomer(customerId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async verifyIdentity(req: Request, res: Response) {
    try {
      const result = await fraudService.verifyIdentity(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getNetworkAnomalies(req: Request, res: Response) {
    try {
      const data = await fraudService.getNetworkAnomalies();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
