import { Request, Response } from 'express';
import { TechnicianService } from '../services/technician.service';

const technicianService = new TechnicianService();

export class TechnicianController {
  
  static async getWorkOrders(req: Request, res: Response) {
    try {
      const technicianId = (req as any).user?.id || 'tech1';
      const data = await technicianService.getWorkOrders(technicianId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getWorkOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await technicianService.getWorkOrder(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async acceptWorkOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const technicianId = (req as any).user?.id || 'tech1';
      const result = await technicianService.acceptWorkOrder(id, technicianId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateWorkOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const technicianId = (req as any).user?.id || 'tech1';
      const result = await technicianService.updateWorkStatus(id, technicianId, status, notes);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async completeWorkOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const technicianId = (req as any).user?.id || 'tech1';
      const result = await technicianService.completeWorkOrder(id, technicianId, notes);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async uploadPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fileUrl } = req.body;
      const technicianId = (req as any).user?.id || 'tech1';
      const result = await technicianService.uploadPhoto(id, technicianId, fileUrl);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateGps(req: Request, res: Response) {
    try {
      const { latitude, longitude, accuracy, speed, heading } = req.body;
      const technicianId = (req as any).user?.id || 'tech1';
      const result = await technicianService.updateGpsLocation(technicianId, latitude, longitude, accuracy, speed, heading);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
