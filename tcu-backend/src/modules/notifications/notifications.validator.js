const { z } = require('zod');

const sendNotificationSchema = z.object({
  body: z.object({
    customerId: z.string().min(1),
    type: z.enum([
      'INVOICE_CREATED', 'PAYMENT_RECEIVED', 
      'SERVICE_SUSPENDED', 'SERVICE_REACTIVATED', 
      'TICKET_CREATED', 'TICKET_ASSIGNED', 'TICKET_CLOSED'
    ]),
    channels: z.array(z.enum(['EMAIL', 'WHATSAPP', 'PUSH', 'SYSTEM'])).min(1),
    payload: z.record(z.any())
  })
});

module.exports = {
  sendNotificationSchema
};
