import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  
  static async activate(req: Request, res: Response) {
    try {
      const { customerId, packageId } = req.body;
      const result = await subscriptionService.activateSubscription(customerId, packageId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deactivate(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const result = await subscriptionService.deactivateSubscription(customerId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerSubscription(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await subscriptionService.getCustomerSubscription(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async renew(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const result = await subscriptionService.renewSubscription(customerId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
