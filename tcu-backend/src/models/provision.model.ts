export interface ProvisionProfile {
  id: string;
  name: string;
  type: 'ONU' | 'ROUTER';
  vlanInternet?: number;
  vlanIptv?: number;
  vlanVoip?: number;
  bandwidthProfile?: string; // e.g. 50M_UP_DOWN
  isDefault: boolean;
}

export interface ProvisionDevice {
  id: string;
  serialNumber: string;
  macAddress?: string;
  deviceType: 'ONU' | 'ROUTER';
  model: string;
  firmwareVersion: string;
  customerId?: string;
  lastProvisionedAt?: Date;
  status: 'ONLINE' | 'OFFLINE' | 'UNPROVISIONED';
  acsId?: string; // GenieACS Device ID
}

export interface ProvisionLog {
  id: string;
  deviceId: string;
  action: 'PROVISION_WAN' | 'PROVISION_WIFI' | 'APPLY_PROFILE' | 'REBOOT' | 'FACTORY_RESET';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  errorDetails?: string;
  recordedBy: string;
  timestamp: Date;
}
