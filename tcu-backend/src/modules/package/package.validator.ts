import { z } from 'zod';

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().min(0),
    bandwidthMbps: z.number().min(1),
  }).passthrough()
});

export const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    bandwidthMbps: z.number().min(1).optional(),
  }).passthrough(),
  params: z.object({
    id: z.string().uuid()
  }).passthrough()
});

export const getPackageSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }).passthrough()
});
