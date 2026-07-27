export interface NotificationTemplate {
  id: string;
  type: 'BILLING_CREATED' | 'BILLING_PAID' | 'BILLING_OVERDUE' | 'TICKET_CREATED' | 'TICKET_UPDATED' | 'TICKET_CLOSED' | 'TECHNICIAN_ASSIGNED' | 'INSTALLATION_SCHEDULED' | 'ONU_OFFLINE' | 'PPPOE_DROP';
  channel: 'EMAIL' | 'WHATSAPP' | 'TELEGRAM';
  subject?: string;
  bodyTemplate: string;
}

export interface NotificationLog {
  id: string;
  customerId?: string;
  type: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'TELEGRAM' | 'BROADCAST';
  title: string;
  body: string;
  metadata?: any;
  status: 'SENT' | 'FAILED' | 'PENDING';
  errorDetails?: string;
  sentAt: Date;
}

export interface SendNotificationPayload {
  customerId?: string;
  phone?: string;
  email?: string;
  telegramChatId?: string;
  title: string;
  body: string;
  metadata?: any;
}
