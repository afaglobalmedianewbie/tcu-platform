import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  
  static async sendEmail(req: Request, res: Response) {
    try {
      const result = await notificationService.sendEmail(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendWhatsApp(req: Request, res: Response) {
    try {
      const result = await notificationService.sendWhatsApp(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendTelegram(req: Request, res: Response) {
    try {
      const result = await notificationService.sendTelegram(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendBroadcast(req: Request, res: Response) {
    try {
      const result = await notificationService.sendBroadcast(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const data = await notificationService.getLogs(limit);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
