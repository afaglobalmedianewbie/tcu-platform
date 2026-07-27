import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

const financeService = new FinanceService();

export class FinanceController {
  
  static async createJournal(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const result = await financeService.createJournalEntry(req.body, userId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getJournal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await financeService.getJournal(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getLedger(req: Request, res: Response) {
    try {
      const data = await financeService.getLedger();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDailyRevenue(req: Request, res: Response) {
    try {
      const data = await financeService.getDailyRevenue();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMonthlyRevenue(req: Request, res: Response) {
    try {
      const data = await financeService.getMonthlyRevenue();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getBep(req: Request, res: Response) {
    try {
      const data = await financeService.calculateBep();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async addCapex(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const result = await financeService.addCapex(req.body, userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async addOpex(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'sys';
      const result = await financeService.addOpex(req.body, userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
