export interface PredictiveSignalHistory {
  id: string;
  onuId: string;
  timestamp: Date;
  rxPower: number;
  txPower: number;
  isOffline: boolean;
}

export interface PredictiveRiskScore {
  targetId: string; // onuId, oltId, or customerId
  type: 'ONU' | 'OLT' | 'CUSTOMER';
  score: number; // 0 - 100
  probabilities: {
    lowSignalProbability?: number;
    offlineProbability?: number;
    pppoeDropProbability?: number;
    hardwareFailureProbability?: number;
    churnProbability?: number;
  };
  lastEvaluated: Date;
}

export interface PredictiveAlert {
  id: string;
  targetId: string;
  type: 'HIGH_RISK_ONU' | 'OLT_OVERHEATING' | 'PPPOE_INSTABILITY' | 'CHURN_PREDICTION';
  message: string;
  riskScore: number;
  resolved: boolean;
  createdAt: Date;
}

export interface PredictiveModelVersion {
  version: string;
  architecture: 'LSTM' | 'TRANSFORMER' | 'ISOLATION_FOREST';
  trainedAt: Date;
  accuracyPercent: number;
  isActive: boolean;
}
