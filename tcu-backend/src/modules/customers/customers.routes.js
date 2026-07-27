const express = require('express');
const router = express.Router();
const controller = require('./customers.controller');

const { asyncHandler } = require('../../core/http/async-handler');
const { validateRequest } = require('../../core/validation/validate-request');
const { createCustomerSchema, updateCustomerSchema } = require('./customers.validator');

// RBAC & Auth placeholder middlewares (Disiapkan untuk menyuntikkan req.user)
const requireAuth = (req, res, next) => next(); 
const requirePermission = (permission) => (req, res, next) => next();

router.use(requireAuth);

router.get('/', 
  requirePermission('customer.read'), 
  asyncHandler(controller.getCustomers)
);

router.get('/:id', 
  requirePermission('customer.read'), 
  asyncHandler(controller.getCustomerById)
);

router.post('/', 
  requirePermission('customer.create'), 
  validateRequest(createCustomerSchema), 
  asyncHandler(controller.createCustomer)
);

router.put('/:id', 
  requirePermission('customer.update'), 
  validateRequest(updateCustomerSchema), 
  asyncHandler(controller.updateCustomer)
);

router.delete('/:id', 
  requirePermission('customer.delete'), 
  asyncHandler(controller.deleteCustomer)
);

router.get('/:id/services', 
  requirePermission('customer.service.read'), 
  asyncHandler(controller.getCustomerServices)
);

router.get('/:id/documents', 
  requirePermission('customer.document.read'), 
  asyncHandler(controller.getCustomerDocuments)
);

module.exports = router;
