import { Request, Response } from 'express';
import { PackageService } from '../services/package.service';

const packageService = new PackageService();

export class PackageController {
  
  static async createPackage(req: Request, res: Response) {
    try {
      const data = await packageService.createPackage(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPackageList(req: Request, res: Response) {
    try {
      const data = await packageService.getPackageList();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await packageService.getPackage(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updatePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await packageService.updatePackage(id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deletePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await packageService.deletePackage(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
