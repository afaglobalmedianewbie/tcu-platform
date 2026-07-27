import { Request, Response } from 'express';
import { OltService } from '../services/olt.service';

const oltService = new OltService();

export class OltController {
  
  static async addOlt(req: Request, res: Response) {
    try {
      const data = await oltService.addOlt(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createVpn(req: Request, res: Response) {
    try {
      const { username, remoteIp } = req.body;
      const data = await oltService.createVpn(username, remoteIp);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOnuList(req: Request, res: Response) {
    try {
      const oltId = req.query.oltId as string;
      const data = await oltService.getOnuList(oltId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOnuDetail(req: Request, res: Response) {
    try {
      const { oltId, onuId } = req.query as any;
      const data = await oltService.getOnuDetail(oltId, onuId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyProfile(req: Request, res: Response) {
    try {
      const { onuId, profile } = req.body;
      const data = await oltService.applyProfile(onuId, profile);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deployCli(req: Request, res: Response) {
    try {
      const { oltIp, vpnIp } = req.body;
      const data = oltService.generateCliScripts(oltIp, vpnIp);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
