export interface NOCAlert {
  id: string;
  source: 'OLT' | 'ONU' | 'PPPOE' | 'VPN' | 'TICKET' | 'SLA';
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  timestamp: Date;
  isAcknowledged: boolean;
}

export interface NOCEvent {
  id: string;
  eventType: string;
  details: string;
  timestamp: Date;
}

export interface NOCMapNode {
  id: string;
  type: 'CUSTOMER' | 'TECHNICIAN' | 'OLT' | 'ZONE';
  name: string;
  lat: number;
  lng: number;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'MOVING';
  metadata?: any;
}

export interface NOCSession {
  id: string;
  sessionId: string;
  type: 'PPPOE' | 'VPN';
  username: string;
  ipAddress: string;
  uptimeHours: number;
  status: 'ACTIVE' | 'DROPPED';
}
