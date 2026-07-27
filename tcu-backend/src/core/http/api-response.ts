import { Response } from 'express';

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  return res.status(statusCode).json({ success: true, message, ...(data !== undefined && { data }) });
};

export const sendError = (res: Response, statusCode: number, message: string, details?: any) => {
  return res.status(statusCode).json({ success: false, message, error: details });
};

export const sendPaginated = <T>(res: Response, statusCode: number, message: string, data: T[], meta: any) => {
  return res.status(statusCode).json({ success: true, message, data, meta });
};
