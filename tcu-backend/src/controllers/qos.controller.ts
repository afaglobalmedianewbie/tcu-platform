import { Request, Response } from 'express';
import { QosService } from '../services/qos.service';

const qosService = new QosService();

export class QosController {
  
  static async createProfile(req: Request, res: Response) {
    try {
      const data = await qosService.createProfile(req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getProfileList(req: Request, res: Response) {
    try {
      const data = await qosService.getProfileList();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const data = await qosService.updateProfile(id, req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteProfile(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const data = await qosService.deleteProfile(id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async applyProfile(req: Request, res: Response) {
    try {
      const { customerId, profileId } = req.body;
      const data = await qosService.applyProfileToCustomer(customerId, profileId);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerQos(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await qosService.getCustomerQos(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateCustomerQos(req: Request, res: Response) {
    try {
      // Manual trigger for evaluating QoS (e.g. Dynamic Boost or manual FUP check)
      const { customerId } = req.body;
      const result = await qosService.evaluateFupAndDynamicQos(customerId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
