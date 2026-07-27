import { Request } from 'express';
import { AuditEventName } from './audit-event.type';
// Prisma import is a placeholder for DB operations
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAudit = async (req: Request, event: AuditEventName, targetId: string, metadata?: any) => {
  try {
    const actorId = req.user?.id || 'SYSTEM_PROCESS';
    
    // Logger terminal fallback
    console.log(`[AUDIT_LOG] Event: ${event} | Actor: ${actorId} | Target: ${targetId}`);
    
    // Placeholder for actual Prisma DB insertion
    /*
    await prisma.auditLog.create({
      data: {
        actorId,
        targetId,
        action: event,
        metadata: metadata || {},
        ipAddress: req.ip || 'unknown',
      }
    });
    */
  } catch (error) {
    console.error('Gagal menulis riwayat audit:', error);
  }
};
