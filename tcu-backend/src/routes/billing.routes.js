/**
 * @file billing.routes.js
 * @description Rute modular untuk domain Billing (Wired dengan Controller, RBAC & AuditLog Soft Mode)
 */
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
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

// POST /invoices/generate
router.post('/invoices/generate', softPermission('billing.create'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: GENERATE_INVOICES, Resource: BILLING`);
  } else {
    await auditService.auditBillingAction(req, 'GENERATE_INVOICES', 'SUCCESS');
  }
  return billingController.generateInvoice(req, res, next);
});

// GET /invoices
router.get('/invoices', softPermission('billing.read'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_INVOICES, Resource: BILLING`);
  } else {
    await auditService.auditBillingAction(req, 'VIEW_INVOICES', 'SUCCESS');
  }
  return billingController.getInvoices(req, res, next);
});

module.exports = router;
