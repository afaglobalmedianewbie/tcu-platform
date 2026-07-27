const { z } = require('zod');

const createInvoiceSchema = z.object({
  body: z.object({
    customerId: z.string().min(1), // Should be uuid, string for placeholder safety
    period: z.string().min(6), // e.g., 2026-07
    amount: z.number().positive()
  })
});

const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1),
    amount: z.number().positive(),
    method: z.enum(['TRANSFER', 'CASH', 'XENDIT_VA'])
  })
});

const reconcileSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1)
  })
});

const refundSchema = z.object({
  body: z.object({
    paymentId: z.string().min(1),
    reason: z.string().min(5)
  })
});

const adjustmentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1),
    adjustmentAmount: z.number(), // can be negative or positive
    reason: z.string().min(5)
  })
});

module.exports = {
  createInvoiceSchema,
  createPaymentSchema,
  reconcileSchema,
  refundSchema,
  adjustmentSchema
};
