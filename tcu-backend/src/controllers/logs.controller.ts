import { Request, Response } from 'express';

export class LogsController {
  
  static async getLogs(req: Request, res: Response) {
    try {
      // Mock Logs matching Next.js UI expected JSON format
      const logs = [
        { id: 1, type: 'INFO', message: 'OLT_PADAHERANG SNMP Connection Established', timestamp: new Date().toISOString() },
        { id: 2, type: 'WARNING', message: 'ONU gpon-onu_0/1/15 low signal detected (-25.2 dBm)', timestamp: new Date().toISOString() },
        { id: 3, type: 'ERROR', message: 'VPN Disconnected for OLT_KALIPUCANG', timestamp: new Date().toISOString() },
        { id: 4, type: 'SUCCESS', message: 'Profile Applied to ONU gpon-onu_0/2/10', timestamp: new Date().toISOString() }
      ];

      res.json({ success: true, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
