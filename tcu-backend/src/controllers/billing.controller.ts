import { Request, Response } from 'express';
import { BillingService } from '../services/billing.service';

const billingService = new BillingService();

export class BillingController {
  
  static async createInvoice(req: Request, res: Response) {
    try {
      const { customerId, amount, description, dueDate } = req.body;
      const invoice = await billingService.createInvoice(customerId, amount, description, new Date(dueDate));
      res.json({ success: true, data: invoice });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getInvoice(req: Request, res: Response) {
    try {
      const invoiceId = req.params.id;
      const invoice = await billingService.getInvoice(invoiceId);
      res.json({ success: true, data: invoice });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async handleXenditCallback(req: Request, res: Response) {
    try {
      // In production, MUST verify Xendit Webhook Token (e.g. req.headers['x-callback-token'])
      await billingService.handleXenditCallback(req.body);
      res.json({ success: true, message: 'Callback processed' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerHistory(req: Request, res: Response) {
    try {
      const customerId = req.params.customer_id;
      const history = await billingService.getCustomerHistory(customerId);
      res.json({ success: true, data: history });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async suspendCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const result = await billingService.suspendCustomer(customerId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async reactivateCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.body;
      const result = await billingService.reactivateCustomer(customerId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
