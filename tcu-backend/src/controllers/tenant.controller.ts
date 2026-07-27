import { Request, Response } from 'express';
import { TenantService } from '../services/tenant.service';

const tenantService = new TenantService();

export class TenantController {
  
  static async createTenant(req: Request, res: Response) {
    try {
      const data = await tenantService.createTenant(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTenant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await tenantService.getTenant(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const data = await tenantService.getTenantList();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateTenant(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await tenantService.updateTenant(id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async suspendTenant(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await tenantService.suspendTenant(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async activateTenant(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await tenantService.activateTenant(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
