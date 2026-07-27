import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export class PaymentController {
  
  static async createInvoice(req: Request, res: Response) {
    try {
      const data = await paymentService.createInvoice(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await paymentService.getInvoice(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await paymentService.getHistoryByCustomer(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async xenditCallback(req: Request, res: Response) {
    try {
      // Must return 200 OK fast to Xendit
      await paymentService.handleCallback('XENDIT', req.body);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async midtransCallback(req: Request, res: Response) {
    try {
      await paymentService.handleCallback('MIDTRANS', req.body);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async manualConfirm(req: Request, res: Response) {
    try {
      const { invoiceId, proofUrl } = req.body;
      const userId = (req as any).user?.id || 'sys';
      const result = await paymentService.confirmManualPayment(invoiceId, proofUrl, userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
