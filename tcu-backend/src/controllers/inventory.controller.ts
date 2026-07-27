import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  
  static async addItem(req: Request, res: Response) {
    try {
      const data = await inventoryService.addItem(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await inventoryService.getItem(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const data = await inventoryService.getInventoryList();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async stockIn(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await inventoryService.stockIn(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async stockOut(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const data = await inventoryService.stockOut(req.body, userId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getStockHistory(req: Request, res: Response) {
    try {
      const data = await inventoryService.getStockHistory();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getWarehouseList(req: Request, res: Response) {
    try {
      const data = await inventoryService.getWarehouses();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async addWarehouse(req: Request, res: Response) {
    try {
      const data = await inventoryService.addWarehouse(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
