import { Router } from 'express';
import { asyncHandler } from '../../core/http/async-handler';
import { requireAuth } from '../../core/security/auth.middleware';
import { requirePermission } from '../../core/security/rbac.middleware';
import { validateRequest } from '../../core/validation/validate-request';
import { paginationQuerySchema } from '../../core/pagination/pagination.dto';
import * as Controller from './package.controller';
import * as Validator from './package.validator';

const router = Router();

router.use(requireAuth);

router.get('/', 
  requirePermission('package.read'), 
  validateRequest(paginationQuerySchema), 
  asyncHandler(Controller.getPackages)
);

router.get('/:id', 
  requirePermission('package.read'), 
  validateRequest(Validator.getPackageSchema), 
  asyncHandler(Controller.getPackageById)
);

router.post('/', 
  requirePermission('package.create'), 
  validateRequest(Validator.createPackageSchema), 
  asyncHandler(Controller.createPackage)
);

router.put('/:id', 
  requirePermission('package.update'), 
  validateRequest(Validator.updatePackageSchema), 
  asyncHandler(Controller.updatePackage)
);

router.patch('/:id/activate', 
  requirePermission('package.update'), 
  validateRequest(Validator.getPackageSchema), 
  asyncHandler(Controller.activatePackage)
);

router.patch('/:id/deactivate', 
  requirePermission('package.update'), 
  validateRequest(Validator.getPackageSchema), 
  asyncHandler(Controller.deactivatePackage)
);

export default router;
