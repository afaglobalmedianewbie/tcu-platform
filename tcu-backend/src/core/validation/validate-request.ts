import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpError } from '../http/http-error';

export const validateRequest = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new HttpError(400, 'Validation Error', 'VALIDATION_FAILED', error.issues));
      } else {
        next(error);
      }
    }
  };
