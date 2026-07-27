import { Request, Response } from 'express';
import { NocService } from '../services/noc.service';

const nocService = new NocService();

export class NocController {

  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await nocService.getDashboardSummary();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOlt(req: Request, res: Response) {
    try {
      const data = await nocService.getOltStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOnu(req: Request, res: Response) {
    try {
      const data = await nocService.getOnuStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPppoe(req: Request, res: Response) {
    try {
      const data = await nocService.getPppoeSessions();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getVpn(req: Request, res: Response) {
    try {
      const data = await nocService.getVpnStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTechnician(req: Request, res: Response) {
    try {
      const data = await nocService.getTechnicianStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomer(req: Request, res: Response) {
    try {
      const data = await nocService.getCustomerStatus();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await nocService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMap(req: Request, res: Response) {
    try {
      const data = await nocService.getMapData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
