/**
 * @file admin.routes.js
 * @description Rute modular untuk domain Admin (Wired dengan Controller, RBAC & AuditLog Soft Mode)
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const requirePermission = require('../core/auth/permission-guard');
const auditService = require('../core/audit/audit.service');
const config = require('../config/features');

const softPermission = (permission) => {
  return async (req, res, next) => {
    if (config.features.useModularRoutes.softModeRBAC) {
      console.log(`[RBAC_SOFT_MODE] User: ${req.user?.id || 'GUEST'} checking permission: ${permission}`);
      return next();
    }
    return requirePermission(permission)(req, res, next);
  };
};

// GET /system/stats
router.get('/system/stats', softPermission('admin.manage'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_STATS, Resource: ADMIN`);
  } else {
    await auditService.logAction(req, 'VIEW_STATS', 'ADMIN', 'SUCCESS');
  }
  return adminController.getSystemStats(req, res, next);
});

// GET /audit
router.get('/audit', softPermission('audit.read'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_AUDIT_LOGS, Resource: ADMIN`);
  } else {
    await auditService.logAction(req, 'VIEW_AUDIT_LOGS', 'ADMIN', 'SUCCESS');
  }
  return adminController.getAuditLogs(req, res, next);
});

// POST /users
router.post('/users', softPermission('user.manage'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: CREATE_USER, Resource: ADMIN`);
  } else {
    await auditService.logAction(req, 'CREATE_USER', 'ADMIN', 'SUCCESS');
  }
  return adminController.manageUsers(req, res, next);
});

// PUT /users/:id/password
router.put('/users/:id/password', softPermission('user.manage'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: CHANGE_PASSWORD, Resource: ADMIN`);
  } else {
    await auditService.logAction(req, 'CHANGE_PASSWORD', 'ADMIN', 'SUCCESS', { targetId: req.params.id });
  }
  return adminController.updateUserPassword(req, res, next);
});

// ─── MAIL SERVER MODULAR ROUTES ───
router.get('/mail', softPermission('system.manage'), (req, res, next) => adminController.getMailAccounts(req, res, next));
router.post('/mail', softPermission('system.manage'), (req, res, next) => adminController.createMailAccount(req, res, next));
router.put('/mail/:id', softPermission('system.manage'), (req, res, next) => adminController.updateMailAccount(req, res, next));
router.patch('/mail/:id/password', softPermission('system.manage'), (req, res, next) => adminController.updateMailPassword(req, res, next));
router.delete('/mail/:id', softPermission('system.manage'), (req, res, next) => adminController.deleteMailAccount(req, res, next));

module.exports = router;
