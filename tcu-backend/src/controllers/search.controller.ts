import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

const searchService = new SearchService();

export class SearchController {
  
  static async search(req: Request, res: Response) {
    try {
      const q = req.query.q as string;
      const userId = (req as any).user?.id || 'sys';
      const data = await searchService.search(q, userId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async searchAdvanced(req: Request, res: Response) {
    try {
      // Logic for advanced filtering by module type
      res.json({ success: true, message: 'Advanced Search executed' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getSuggestions(req: Request, res: Response) {
    try {
      const q = req.query.q as string;
      const data = await searchService.getSuggestions(q);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async rebuildIndex(req: Request, res: Response) {
    try {
      const data = await searchService.rebuildIndex();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
