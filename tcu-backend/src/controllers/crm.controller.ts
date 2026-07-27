import { Request, Response } from 'express';
import { CrmService } from '../services/crm.service';

const crmService = new CrmService();

export class CrmController {
  
  static async createCustomer(req: Request, res: Response) {
    try {
      const customer = await crmService.createCustomer(req.body);
      res.json({ success: true, data: customer });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await crmService.getCustomer(id);
      res.json({ success: true, data: customer });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await crmService.updateCustomer(id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async activateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await crmService.activateCustomer(id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deactivateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await crmService.deactivateCustomer(id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerServices(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await crmService.getCustomerServices(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerBilling(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await crmService.getCustomerBilling(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCustomerTickets(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await crmService.getCustomerTickets(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
