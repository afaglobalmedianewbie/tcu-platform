/**
 * @file customer.routes.js
 * @description Rute modular untuk domain Customer (Wired dengan Controller, RBAC & AuditLog Soft Mode)
 */
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const requirePermission = require('../core/auth/permission-guard');
const auditService = require('../core/audit/audit.service');
const config = require('../config/features');

// Helper wrapper untuk soft-mode RBAC
const softPermission = (permission) => {
  return async (req, res, next) => {
    if (config.features.useModularRoutes.softModeRBAC) {
      console.log(`[RBAC_SOFT_MODE] User: ${req.user?.id || 'GUEST'} checking permission: ${permission}`);
      // Di soft mode, jalankan audit log jika ada kegagalan otorisasi (tapi jangan gagalkan request)
      return next();
    }
    return requirePermission(permission)(req, res, next);
  };
};

// GET /profile
router.get('/profile', softPermission('customer.read'), async (req, res, next) => {
  // Pemicu Audit Log Konseptual (Soft Mode)
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_PROFILE, Resource: CUSTOMER`);
  } else {
    await auditService.auditCustomerAction(req, 'VIEW_PROFILE', 'SUCCESS');
  }
  return customerController.getProfile(req, res, next);
});

// GET /invoices
router.get('/invoices', softPermission('customer.read'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_INVOICES, Resource: CUSTOMER`);
  } else {
    await auditService.auditCustomerAction(req, 'VIEW_INVOICES', 'SUCCESS');
  }
  return customerController.getInvoices(req, res, next);
});

// POST /invoices/:id/pay
router.post('/invoices/:id/pay', softPermission('customer.update'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: PAY_INVOICE, Resource: CUSTOMER`);
  } else {
    await auditService.auditCustomerAction(req, 'PAY_INVOICE', 'SUCCESS', { invoiceId: req.params.id });
  }
  return customerController.payInvoice(req, res, next);
});

// PUT /profile
router.put('/profile', softPermission('customer.update'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: UPDATE_PROFILE, Resource: CUSTOMER`);
  } else {
    await auditService.auditCustomerAction(req, 'UPDATE_PROFILE', 'SUCCESS');
  }
  return customerController.updateProfile(req, res, next);
});

// FEATURE 4: Self-Service Customer Portal via GenieACS TR-069
router.post('/reboot-ont', softPermission('customer.update'), (req, res, next) => customerController.rebootOnt(req, res, next));
router.post('/change-wifi', softPermission('customer.update'), (req, res, next) => customerController.changeWifiPassword(req, res, next));
router.get('/device-status', softPermission('customer.read'), (req, res, next) => customerController.getDeviceStatus(req, res, next));

module.exports = router;

