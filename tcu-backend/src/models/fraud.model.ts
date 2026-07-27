export interface FraudScore {
  customerId: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastEvaluated: Date;
  factors: Array<{
    category: 'BILLING' | 'IDENTITY' | 'NETWORK' | 'ACCOUNT';
    reason: string;
    points: number;
  }>;
}

export interface FraudAlert {
  id: string;
  customerId: string;
  category: 'BILLING' | 'IDENTITY' | 'NETWORK' | 'ACCOUNT';
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  actionTaken?: string;
  resolved: boolean;
  createdAt: Date;
}

export interface FraudIdentity {
  id: string;
  customerId: string;
  ktpHash: string;
  kkHash: string;
  phone: string;
  email: string;
  isVerified: boolean;
  verificationNotes?: string;
}

export interface FraudNetworkEvent {
  id: string;
  customerId: string;
  type: 'SESSION_CLONING' | 'ABNORMAL_BANDWIDTH' | 'MAC_SPOOFING';
  details: string;
  timestamp: Date;
}
