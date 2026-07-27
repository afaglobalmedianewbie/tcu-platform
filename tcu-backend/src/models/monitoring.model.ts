export interface MonitoringLog {
  id: string;
  source: 'SNMP' | 'VPN' | 'CLI' | 'BILLING' | 'TICKET';
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: Date;
}

export interface MonitoringAlert {
  id: string;
  type: 'OFFLINE_ONU' | 'LOW_SIGNAL' | 'PPPOE_DROP' | 'UNPAID_INVOICE' | 'TICKET_SLA_OVERDUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  targetId: string; // Could be onuId, customerId, or ticketId
  resolved: boolean;
  createdAt: Date;
}

export interface PPPoESession {
  sessionId: string;
  username: string;
  ip: string;
  uptime: string;
  downloadBytes: number;
  uploadBytes: number;
  nasIp: string;
}
