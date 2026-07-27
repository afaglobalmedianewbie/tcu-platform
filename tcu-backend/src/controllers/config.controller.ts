import { Request, Response } from 'express';
import { ConfigService } from '../services/config.service';

const configService = new ConfigService();

export class ConfigController {
  
  static async createTemplate(req: Request, res: Response) {
    try {
      const data = await configService.createTemplate(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await configService.getTemplate(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listTemplates(req: Request, res: Response) {
    try {
      const data = await configService.listTemplates();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateTemplate(req: Request, res: Response) {
    try {
      const { id, payload } = req.body;
      const data = await configService.updateTemplate(id, payload);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteTemplate(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const data = await configService.deleteTemplate(id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyTemplate(req: Request, res: Response) {
    try {
      const { templateId, targetId } = req.body;
      const data = await configService.applyTemplate(templateId, targetId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyOlt(req: Request, res: Response) {
    try {
      const { targetId, payload } = req.body;
      const data = await configService.applyOltConfig(targetId, payload);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyOnu(req: Request, res: Response) {
    try {
      const { targetId, payload } = req.body;
      const data = await configService.applyOnuConfig(targetId, payload);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyRouter(req: Request, res: Response) {
    try {
      const { targetId, payload } = req.body;
      const data = await configService.applyRouterConfig(targetId, payload);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
