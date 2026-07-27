import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../http/http-error';
import { PermissionType } from './permission.type';

export const requirePermission = (permission: PermissionType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new HttpError(401, 'Unauthorized', 'USER_NOT_FOUND'));
    }

    if (!user.permissions.includes(permission) && !user.roles.includes('super_admin')) {
      return next(new HttpError(403, 'Forbidden access', 'INSUFFICIENT_PERMISSION', { required: permission }));
    }

    next();
  };
};
