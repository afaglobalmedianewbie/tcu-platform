import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(8),
    identityNumber: z.string().min(5),
  }).passthrough()
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(8).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
  }).passthrough(),
  params: z.object({
    id: z.string().uuid()
  }).passthrough()
});

export const getCustomerSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }).passthrough()
});
