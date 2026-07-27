export interface SecurityThreat {
  id: string;
  category: 'NETWORK' | 'VPN' | 'BILLING' | 'IDENTITY' | 'SYSTEM';
  threatType: 'PPPOE_CLONING' | 'MAC_SPOOFING' | 'BANDWIDTH_SPIKE' | 'AUTH_FAILURE' | 'ONU_OFFLINE_PATTERN' | 'VPN_ANOMALY' | 'BILLING_FRAUD' | 'IDENTITY_MISMATCH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetId?: string; // Could be customerId, onuId, or ipAddress
  description: string;
  score: number; // 0 - 100
  isResolved: boolean;
  detectedAt: Date;
}

export interface SecurityLog {
  id: string;
  threatId?: string;
  actionTaken: 'AUTO_BLOCKED' | 'AUTO_SUSPENDED' | 'NOTIFIED_NOC' | 'NO_ACTION';
  details: string;
  timestamp: Date;
}

export interface SecurityBlockList {
  id: string;
  type: 'MAC_ADDRESS' | 'IP_ADDRESS' | 'PPPOE_USER';
  value: string;
  reason: string;
  blockedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}
