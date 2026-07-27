const express = require('express');
const router = express.Router();
const controller = require('./billing.controller');

const { asyncHandler } = require('../../core/http/async-handler');
const { validateRequest } = require('../../core/validation/validate-request');
const validator = require('./billing.validator');

const requireAuth = (req, res, next) => next(); 
const requirePermission = (permission) => (req, res, next) => next();

router.use(requireAuth);

router.get('/invoices', 
  requirePermission('billing.read'), 
  asyncHandler(controller.getInvoices)
);

router.get('/invoices/:id', 
  requirePermission('billing.read'), 
  asyncHandler(controller.getInvoiceById)
);

router.post('/invoices', 
  requirePermission('billing.create'), 
  validateRequest(validator.createInvoiceSchema), 
  asyncHandler(controller.createInvoice)
);

router.get('/payments', 
  requirePermission('payment.read'), 
  asyncHandler(controller.getPayments)
);

router.post('/payments', 
  requirePermission('payment.create'), 
  validateRequest(validator.createPaymentSchema), 
  asyncHandler(controller.createPayment)
);

router.post('/reconcile', 
  requirePermission('payment.reconcile'), 
  validateRequest(validator.reconcileSchema), 
  asyncHandler(controller.reconcilePayment)
);

router.post('/refund', 
  requirePermission('billing.refund'), 
  validateRequest(validator.refundSchema), 
  asyncHandler(controller.refundPayment)
);

router.post('/adjustment', 
  requirePermission('billing.adjustment'), 
  validateRequest(validator.adjustmentSchema), 
  asyncHandler(controller.adjustInvoice)
);

module.exports = router;
