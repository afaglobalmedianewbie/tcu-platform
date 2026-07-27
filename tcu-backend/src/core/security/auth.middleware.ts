import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../http/http-error';
import { CurrentUser } from './current-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Unauthorized access', 'MISSING_TOKEN'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tcu-secret-key') as CurrentUser;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new HttpError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }
};
