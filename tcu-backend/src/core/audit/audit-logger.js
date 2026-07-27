const { PrismaClient } = require('@prisma/client');

// Prisma Placeholder: Will be swapped with singleton once DB is fully normalized
const prisma = new PrismaClient();

const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  ASSIGN: 'assign',
  PAYMENT: 'payment',
  TICKET: 'ticket'
};

/**
 * Creates an immutable audit log record asynchronously.
 * Designed to never block the main request thread and silently catches errors (fail-safe).
 */
const logAudit = async ({
  actorId = 'SYSTEM',
  targetId,
  targetType,
  action,
  metadata = {},
  ipAddress = 'unknown',
  userAgent = 'unknown'
}) => {
  try {
    // Validate action
    if (!Object.values(AUDIT_ACTIONS).includes(action)) {
      console.warn(`[AUDIT_WARNING] Unrecognized audit action: ${action}`);
    }

    // Prisma integration compatible with future AuditLog schema
    /*
    await prisma.auditLog.create({
      data: {
        actorId,
        targetId,
        targetType,
        action,
        metadata: metadata ? JSON.stringify(metadata) : '{}',
        ipAddress,
        userAgent,
        createdAt: new Date()
      }
    });
    */

    // Console logging as temporary fallback until migration is applied
    console.log(`[AUDIT_LOG] [${new Date().toISOString()}] Action: ${action} | Actor: ${actorId} | Target: ${targetType}(${targetId}) | IP: ${ipAddress}`);

  } catch (error) {
    // CRITICAL: Must never throw upwards or crash the event loop
    console.error(`[AUDIT_ERROR] Failed to save audit log: ${error.message}`);
  }
};

// Mencegah eksportasi fungsi Delete/Update (Aturan: logs must not be updated/deleted)
module.exports = {
  AUDIT_ACTIONS,
  logAudit
};
