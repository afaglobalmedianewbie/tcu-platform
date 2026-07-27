const express = require('express');
const router = express.Router();
const controller = require('./tickets.controller');

const { asyncHandler } = require('../../core/http/async-handler');
const { validateRequest } = require('../../core/validation/validate-request');
const { createTicketSchema, updateTicketSchema, assignTicketSchema } = require('./tickets.validator');

const requireAuth = (req, res, next) => next(); 
const requirePermission = (permission) => (req, res, next) => next();

router.use(requireAuth);

router.get('/', 
  requirePermission('ticket.read'), 
  asyncHandler(controller.getTickets)
);

router.get('/:id', 
  requirePermission('ticket.read'), 
  asyncHandler(controller.getTicketById)
);

router.post('/', 
  requirePermission('ticket.create'), 
  validateRequest(createTicketSchema), 
  asyncHandler(controller.createTicket)
);

router.put('/:id', 
  requirePermission('ticket.update'), 
  validateRequest(updateTicketSchema), 
  asyncHandler(controller.updateTicket)
);

router.post('/:id/assign', 
  requirePermission('ticket.assign'), 
  validateRequest(assignTicketSchema), 
  asyncHandler(controller.assignTicket)
);

router.post('/:id/close', 
  requirePermission('ticket.close'), 
  asyncHandler(controller.closeTicket)
);

router.post('/:id/reopen', 
  requirePermission('ticket.update'), 
  asyncHandler(controller.reopenTicket)
);

module.exports = router;
