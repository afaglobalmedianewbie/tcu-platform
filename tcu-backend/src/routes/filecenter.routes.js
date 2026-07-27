/**
 * @file filecenter.routes.js
 * @description Rute modular untuk domain File Center (Wired dengan Controller, RBAC & AuditLog Soft Mode)
 */
const express = require('express');
const router = express.Router();
const fileCenterController = require('../controllers/filecenter.controller');
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

// POST /upload
router.post('/upload', softPermission('file.upload'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: FILE_UPLOADED, Resource: FILE_CENTER`);
  } else {
    await auditService.auditFileCenterAction(req, 'FILE_UPLOADED', 'SUCCESS');
  }
  return fileCenterController.upload(req, res, next);
});

// GET /download/:id
router.get('/download/:id', softPermission('file.read'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: FILE_DOWNLOADED, Resource: FILE_CENTER`);
  } else {
    await auditService.auditFileCenterAction(req, 'FILE_DOWNLOADED', 'SUCCESS', { fileId: req.params.id });
  }
  return fileCenterController.download(req, res, next);
});

// DELETE /:id
router.delete('/:id', softPermission('file.delete'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: FILE_DELETED, Resource: FILE_CENTER`);
  } else {
    await auditService.auditFileCenterAction(req, 'FILE_DELETED', 'SUCCESS', { fileId: req.params.id });
  }
  return fileCenterController.deleteFile(req, res, next);
});

module.exports = router;
