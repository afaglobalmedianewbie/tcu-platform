export interface OltDevice {
  id: string;
  name: string;
  ip: string;
  uptime: string;
  cpu: number;
  temp: number;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
}

export interface OnuSignalData {
  range: string; // e.g., "-15 to -20 dBm"
  count: number;
}

export interface PppoeSession {
  username: string;
  ipAddress: string;
  uptime: string;
  macAddress: string;
  callerId: string;
  profile: string;
}

export interface NocMapPoint {
  id: string;
  type: 'CUSTOMER' | 'TECHNICIAN' | 'OLT';
  name: string;
  latitude: number;
  longitude: number;
  status: 'ONLINE' | 'OFFLINE' | 'ACTIVE' | 'IDLE';
}

export interface NocDashboardData {
  olts: OltDevice[];
  onuSignals: OnuSignalData[];
  pppoeSessions: PppoeSession[];
  mapPoints: NocMapPoint[];
}
