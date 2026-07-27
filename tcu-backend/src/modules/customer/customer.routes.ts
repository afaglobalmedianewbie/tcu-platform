import { Router } from 'express';
import { asyncHandler } from '../../core/http/async-handler';
import { requireAuth } from '../../core/security/auth.middleware';
import { requirePermission } from '../../core/security/rbac.middleware';
import { validateRequest } from '../../core/validation/validate-request';
import { paginationQuerySchema } from '../../core/pagination/pagination.dto';
import * as Controller from './customer.controller';
import * as Validator from './customer.validator';

const router = Router();

// Pasang perisai JWT Autentikasi untuk selururh endpoint nasabah
router.use(requireAuth);

router.get('/', 
  requirePermission('customer.read'), 
  validateRequest(paginationQuerySchema), 
  asyncHandler(Controller.getCustomers)
);

router.get('/:id', 
  requirePermission('customer.read'), 
  validateRequest(Validator.getCustomerSchema), 
  asyncHandler(Controller.getCustomerById)
);

router.post('/', 
  requirePermission('customer.create'), 
  validateRequest(Validator.createCustomerSchema), 
  asyncHandler(Controller.createCustomer)
);

router.put('/:id', 
  requirePermission('customer.update'), 
  validateRequest(Validator.updateCustomerSchema), 
  asyncHandler(Controller.updateCustomer)
);

router.delete('/:id', 
  requirePermission('customer.delete'), 
  validateRequest(Validator.getCustomerSchema), 
  asyncHandler(Controller.deleteCustomer)
);

export default router;
