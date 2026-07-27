export interface NodeRegistry {
  id: string;
  ipAddress: string;
  port: number;
  weight: number; // For weighted routing
  status: 'ACTIVE' | 'DRAINING' | 'OFFLINE';
  createdAt: Date;
}

export interface NodeHealth {
  nodeId: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeConnections: number;
  latencyMs: number;
  errorRatePercent: number;
  lastHeartbeat: Date;
}

export interface LoadBalanceMetrics {
  id: string;
  timestamp: Date;
  requestsPerSecond: number;
  averageLatencyMs: number;
  totalErrors: number;
  nodesDistribution: Record<string, number>; // Maps nodeId to request count
}
