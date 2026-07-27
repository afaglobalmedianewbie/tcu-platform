import { Request, Response, NextFunction } from 'express';
import { RolePermissions } from './rbac.matrix';

/**
 * Guard to check if the user has one of the allowed roles.
 * Examples: 
 * - requireRole("SUPERADMIN")
 * - requireRole(["OPERATOR", "TEKNISI"])
 */
export const requireRole = (allowedRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    
    if (!userRole) {
      return res.status(403).json({ status: 'forbidden', message: 'Access denied: Role not found' });
    }

    // Always allow SUPERADMIN
    if (userRole === 'SUPERADMIN') {
      return next();
    }

    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user's role is in the allowed roles
    if (rolesArray.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ status: 'forbidden', message: 'Access denied' });
  };
};

/**
 * Guard to check if the user has permission to access a specific module
 * based on the rbac.matrix.ts file.
 * Example:
 * - requirePermission("OLT")
 */
export const requirePermission = (module: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    
    if (!userRole) {
      return res.status(403).json({ status: 'forbidden', message: 'Access denied: Role not found' });
    }

    // Always allow SUPERADMIN
    if (userRole === 'SUPERADMIN') {
      return next();
    }

    const allowedModules = (RolePermissions as any)[userRole] || [];
    
    // If the role has 'ALL' access or specifically has the module access
    if (allowedModules.includes('ALL') || allowedModules.includes(module)) {
      return next();
    }

    return res.status(403).json({ status: 'forbidden', message: `Access denied: Missing permission for module '${module}'` });
  };
};
