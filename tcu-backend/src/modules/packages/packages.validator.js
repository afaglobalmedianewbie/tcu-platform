const { z } = require('zod');

const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    price: z.number().positive(),
    speed: z.string().min(1)
  })
});

const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    speed: z.string().min(1).optional()
  })
});

module.exports = {
  createPackageSchema,
  updatePackageSchema
};
