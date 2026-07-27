import { Request, Response, NextFunction } from 'express';
import { AuditEventName } from './audit-event.type';

export const captureAuditContext = (eventName: AuditEventName) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Menyisipkan label audit ke muatan request secara pasif
    res.locals.auditEvent = eventName;
    next();
  };
};
