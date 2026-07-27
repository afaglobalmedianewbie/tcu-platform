export type EventType =
  | 'billing.invoice.created'
  | 'billing.invoice.paid'
  | 'billing.invoice.expired'
  | 'ticket.created'
  | 'ticket.updated'
  | 'ticket.closed'
  | 'technician.location.updated'
  | 'monitoring.onu.offline'
  | 'monitoring.signal.low'
  | 'security.threat.detected'
  | 'qos.profile.applied'
  | 'provisioning.device.updated';

export interface EventLog {
  id: string;
  eventType: EventType;
  payload: any;
  publisherId: string;
  timestamp: Date;
}

export interface EventQueue {
  id: string;
  eventId: string; // Links to EventLog
  subscriberId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'DEAD_LETTER';
  retryCount: number;
  lastAttemptAt?: Date;
  errorMessage?: string;
}

export interface EventSubscriber {
  id: string;
  name: string; // e.g. "NotificationService" or "BillingSyncJob"
  eventTypes: EventType[];
  webhookUrl?: string; // Optional if subscribing via HTTP
  isActive: boolean;
}
