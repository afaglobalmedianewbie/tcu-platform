export interface TrafficHistory {
  id: string;
  targetId: string; // customerId, oltPortId, or networkSegment
  timestamp: Date;
  downloadBytes: number;
  uploadBytes: number;
  activeSessionsCount: number;
}

export interface TrafficPrediction {
  id: string;
  targetId: string;
  forecastWindowMs: number; // e.g. next 1 hour (3600000)
  predictedDownloadBytes: number;
  predictedUploadBytes: number;
  congestionProbability: number;
  heavyUserFlag: boolean;
  generatedAt: Date;
}

export interface TrafficOptimizationLog {
  id: string;
  targetId: string;
  actionTaken: 'DYNAMIC_QOS_THROTTLE' | 'DYNAMIC_QOS_BOOST' | 'MITIGATE_CONGESTION' | 'AUTO_NOTIFY_NOC';
  details: string;
  resolved: boolean;
  timestamp: Date;
}
