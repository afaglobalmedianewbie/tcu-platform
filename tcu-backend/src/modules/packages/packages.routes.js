const express = require('express');
const router = express.Router();
const controller = require('./packages.controller');

const { asyncHandler } = require('../../core/http/async-handler');
const { validateRequest } = require('../../core/validation/validate-request');
const { createPackageSchema, updatePackageSchema } = require('./packages.validator');

const requireAuth = (req, res, next) => next(); 
const requirePermission = (permission) => (req, res, next) => next();

router.use(requireAuth);

router.get('/', 
  requirePermission('package.read'), 
  asyncHandler(controller.getPackages)
);

router.get('/:id', 
  requirePermission('package.read'), 
  asyncHandler(controller.getPackageById)
);

router.post('/', 
  requirePermission('package.create'), 
  validateRequest(createPackageSchema), 
  asyncHandler(controller.createPackage)
);

router.put('/:id', 
  requirePermission('package.update'), 
  validateRequest(updatePackageSchema), 
  asyncHandler(controller.updatePackage)
);

router.patch('/:id/activate', 
  requirePermission('package.activate'), 
  asyncHandler(controller.activatePackage)
);

router.patch('/:id/deactivate', 
  requirePermission('package.deactivate'), 
  asyncHandler(controller.deactivatePackage)
);

module.exports = router;
