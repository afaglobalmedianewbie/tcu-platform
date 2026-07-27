export interface PredictRisk {
  customerId: string;
  customerName: string;
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  recommendation: string;
}

export interface TrafficOverview {
  spikes: { timestamp: string; loadGbps: number; isSpike: boolean }[];
  anomalies: { id: string; timestamp: string; ipSource: string; type: string; severity: 'MEDIUM' | 'HIGH' | 'CRITICAL'; description: string }[];
}
