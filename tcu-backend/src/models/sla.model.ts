export interface SLAPolicy {
  id: string;
  type: 'TICKET_RESPONSE' | 'TECHNICIAN_ARRIVAL' | 'WORK_ORDER_COMPLETION' | 'CRITICAL_ALERT' | 'LOW_SIGNAL_ALERT';
  maxTimeMinutes: number;
  description: string;
  isActive: boolean;
}

export interface SLARecord {
  id: string;
  targetId: string; // ticket_id or workorder_id
  type: string;
  startTime: Date;
  targetEndTime: Date;
  actualEndTime?: Date;
  isViolated: boolean;
  violationDurationMinutes?: number;
}

export interface SLAAlert {
  id: string;
  slaRecordId: string;
  targetId: string;
  type: string;
  message: string;
  createdAt: Date;
  resolved: boolean;
}
