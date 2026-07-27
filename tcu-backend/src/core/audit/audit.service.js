/**
 * @file audit.service.js
 * @description Layanan Audit (AuditLog) Polimorfik Sadar-RBAC yang mendukung penegakan basis data.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../../config/features');

const getModuleName = (resource) => {
  const res = resource.toLowerCase();
  if (res === 'file_center') return 'file';
  return res; // customer, billing, ticket, admin
};

class AuditService {
  /**
   * Mengeksekusi pencatatan jejak audit secara mendalam dengan menyerap konteks RBAC
   */
  async logAction(req, action, resource, result, metadata = {}) {
    try {
      const userId = req?.user?.id || null;
      const role = req?.user?.role || 'GUEST';
      const permissions = req.resolvedPermissions ? Array.from(req.resolvedPermissions) : [];
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'UNKNOWN';
      const userAgent = req.headers['user-agent'] || 'UNKNOWN';

      const payloadData = {
        rbacContext: { role, permissions },
        result,
        ...metadata
      };

      const auditPayload = {
        user_id: userId,
        targetId: metadata.targetId || null,
        targetType: resource,
        action: action,
        endpoint: req?.originalUrl || req?.url || null,
        method: req?.method || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        payload: JSON.stringify(payloadData)
      };

      const moduleName = getModuleName(resource);
      const isSoftMode = config.features.useModularRoutes.auditOverrides[moduleName] !== false
        && config.features.useModularRoutes.softModeAudit;

      if (isSoftMode) {
        console.log(`[AUDIT_SOFT_MODE] ${result} | User: ${userId || 'SYSTEM'} | Action: ${action} | Resource: ${resource}`);
        return true;
      }

      // Hard mode: Tulis langsung ke database PostgreSQL
      await prisma.auditLog.create({
        data: auditPayload
      });
      
      console.log(`[AUDIT_MANDATORY] Logged to DB. User: ${userId || 'SYSTEM'} | Action: ${action} | Resource: ${resource}`);
      return true;
    } catch (error) {
      console.error('[AUDIT_ERROR] Gagal menulis ke DB:', error);
      return false;
    }
  }

  // =========================================================
  // HOOKS INTEGRASI MODUL
  // =========================================================

  async auditCustomerAction(req, action, result, metadata = {}) {
    return this.logAction(req, action, 'CUSTOMER', result, metadata);
  }

  async auditBillingAction(req, action, result, metadata = {}) {
    return this.logAction(req, action, 'BILLING', result, metadata);
  }

  async auditTicketAction(req, action, result, metadata = {}) {
    return this.logAction(req, action, 'TICKET', result, metadata);
  }

  async auditFileCenterAction(req, action, result, metadata = {}) {
    return this.logAction(req, action, 'FILE_CENTER', result, metadata);
  }
}

module.exports = new AuditService();
