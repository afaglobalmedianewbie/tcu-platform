const { z } = require('zod');

const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(8)
  })
});

const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(8).optional()
  })
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema
};
