const { z } = require('zod');

const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(5),
    description: z.string().min(10),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
  })
});

const updateTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
  })
});

const assignTicketSchema = z.object({
  body: z.object({
    assigneeId: z.string().min(1) // Should use .uuid() but string is safer for fallback placeholder
  })
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  assignTicketSchema
};
