import { Request, Response } from 'express';
import { FileService } from '../services/file.service';

const fileService = new FileService();

export class FileController {
  
  static async upload(req: Request, res: Response) {
    try {
      // In a real Express app, 'multer' or 'express-fileupload' would populate req.file/req.files
      const file = (req as any).file || { originalName: 'doc.jpg', size: 1024, mimeType: 'image/jpeg' }; 
      const { type, customerId, ticketId } = req.body;
      const uploaderId = (req as any).user?.id || 'sys';
      const uploaderRole = (req as any).user?.role || 'CUSTOMER';

      const result = await fileService.uploadFile(file, { type, customerId, ticketId, uploaderId, uploaderRole });
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getFile(req: Request, res: Response) {
    try {
      const { file_id } = req.params;
      const fileData = await fileService.getFile(file_id);
      
      // Real app would stream the file from S3 / Local storage here using res.sendFile or stream.pipe(res)
      // For API perspective, we can return the secure URL
      res.json({ success: true, data: fileData });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getFilesByCustomer(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const data = await fileService.getFilesByCustomer(customer_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getFilesByTicket(req: Request, res: Response) {
    try {
      const { ticket_id } = req.params;
      const data = await fileService.getFilesByTicket(ticket_id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteFile(req: Request, res: Response) {
    try {
      const { file_id } = req.params;
      // Should verify ownership / RBAC here before deletion
      const result = await fileService.deleteFile(file_id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
