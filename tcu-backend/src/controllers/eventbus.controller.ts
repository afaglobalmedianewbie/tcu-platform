import { Request, Response } from 'express';
import { EventBusService } from '../services/eventbus.service';

const eventBusService = new EventBusService();

export class EventBusController {
  
  static async publish(req: Request, res: Response) {
    try {
      const { eventType, payload } = req.body;
      const publisherId = (req as any).user?.id || 'API-GATEWAY';
      const data = await eventBusService.publish(eventType, payload, publisherId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getSubscribers(req: Request, res: Response) {
    try {
      const data = await eventBusService.getSubscribers();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const data = await eventBusService.getLogs();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async replay(req: Request, res: Response) {
    try {
      const { eventId } = req.body;
      const data = await eventBusService.replayEvent(eventId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
