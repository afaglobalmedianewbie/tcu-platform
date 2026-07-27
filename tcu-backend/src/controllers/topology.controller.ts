import { Request, Response } from 'express';
import { TopologyService } from '../services/topology.service';

const topologyService = new TopologyService();

export class TopologyController {
  
  static async getOltTopology(req: Request, res: Response) {
    try {
      const { olt_id } = req.params;
      const data = await topologyService.getOltTopology(olt_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOnuTopology(req: Request, res: Response) {
    try {
      const { onu_id } = req.params;
      const data = await topologyService.getOnuTopology(onu_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerTopology(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await topologyService.getCustomerTopology(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getMap(req: Request, res: Response) {
    try {
      const data = await topologyService.getMapData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAlerts(req: Request, res: Response) {
    try {
      const data = await topologyService.getAlerts();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
