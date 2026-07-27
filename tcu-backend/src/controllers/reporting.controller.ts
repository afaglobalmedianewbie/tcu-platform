import { Request, Response } from 'express';
import { ReportingService } from '../services/reporting.service';

const reportingService = new ReportingService();

export class ReportingController {

  static async getRevenueDaily(req: Request, res: Response) {
    try {
      const data = await reportingService.getRevenueDaily();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getRevenueMonthly(req: Request, res: Response) {
    try {
      const data = await reportingService.getRevenueMonthly();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getRevenueYearly(req: Request, res: Response) {
    try {
      const data = await reportingService.getRevenueYearly();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerGrowth(req: Request, res: Response) {
    try {
      const data = await reportingService.getCustomerGrowth();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerChurn(req: Request, res: Response) {
    try {
      const data = await reportingService.getCustomerChurn();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getNetworkUptime(req: Request, res: Response) {
    try {
      const data = await reportingService.getNetworkUptime();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getNetworkSignal(req: Request, res: Response) {
    try {
      const data = await reportingService.getNetworkSignal();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getPppoeSessions(req: Request, res: Response) {
    try {
      const data = await reportingService.getPppoeSessionsAnalytics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTechnicianPerformance(req: Request, res: Response) {
    try {
      const data = await reportingService.getTechnicianPerformance();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDashboard(req: Request, res: Response) {
    try {
      const data = await reportingService.getDashboardSummary();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
