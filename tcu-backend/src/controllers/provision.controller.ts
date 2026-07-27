import { Request, Response } from 'express';
import { ProvisionService } from '../services/provision.service';

const provisionService = new ProvisionService();

export class ProvisionController {
  
  static async provisionOnu(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.provisionOnu(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async provisionRouter(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.provisionRouter(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDevice(req: Request, res: Response) {
    try {
      const { sn } = req.params;
      const data = await provisionService.getDevice(sn);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.applyProfile(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateWifi(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.updateWifi(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateWan(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.updateWan(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async reboot(req: Request, res: Response) {
    try {
      const { sn } = req.body;
      const userId = (req as any).user?.id || 'sys';
      const data = await provisionService.rebootDevice(sn, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
