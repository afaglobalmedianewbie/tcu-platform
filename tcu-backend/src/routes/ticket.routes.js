/**
 * @file ticket.routes.js
 * @description Rute modular untuk domain Ticket & Work Order (Wired dengan Controller, RBAC & AuditLog Soft Mode)
 */
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
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

// GET /
router.get('/', softPermission('ticket.read'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: VIEW_TICKETS, Resource: TICKET`);
  } else {
    await auditService.auditTicketAction(req, 'VIEW_TICKETS', 'SUCCESS');
  }
  return ticketController.getTickets(req, res, next);
});

// PATCH /:id/assign
router.patch('/:id/assign', softPermission('ticket.assign'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: ASSIGN_TICKET, Resource: TICKET`);
  } else {
    await auditService.auditTicketAction(req, 'ASSIGN_TICKET', 'SUCCESS', { ticketId: req.params.id });
  }
  return ticketController.assignTicket(req, res, next);
});

// POST /work-orders
router.post('/work-orders', softPermission('ticket.assign'), async (req, res, next) => {
  if (config.features.useModularRoutes.softModeAudit) {
    console.log(`[AUDIT_SOFT_MODE] Action: CREATE_WORK_ORDER, Resource: TICKET`);
  } else {
    await auditService.auditTicketAction(req, 'CREATE_WORK_ORDER', 'SUCCESS');
  }
  return ticketController.createWorkOrder(req, res, next);
});

module.exports = router;
