import { Request, Response } from 'express';
import { ClusterService } from '../services/cluster.service';

const clusterService = new ClusterService();

export class ClusterController {
  
  static async getOltList(req: Request, res: Response) {
    try {
      const data = await clusterService.getOltList();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getOltDetails(req: Request, res: Response) {
    try {
      const { olt_id } = req.params;
      const data = await clusterService.getOltDetails(olt_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async addOlt(req: Request, res: Response) {
    try {
      const data = await clusterService.addOlt(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async removeOlt(req: Request, res: Response) {
    try {
      const { oltId } = req.body;
      const data = await clusterService.removeOlt(oltId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getTopology(req: Request, res: Response) {
    try {
      const data = await clusterService.getTopology('CLUSTER-1');
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getBalanceReport(req: Request, res: Response) {
    try {
      const data = await clusterService.analyzeClusterBalance('CLUSTER-1');
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async rebalanceCluster(req: Request, res: Response) {
    try {
      const data = await clusterService.rebalanceCluster('CLUSTER-1');
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
