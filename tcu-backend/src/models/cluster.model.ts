export interface OLTCluster {
  id: string;
  name: string;
  location: string;
  masterRouterId: string; // e.g. MIKROTIK-CORE
  totalOltNodes: number;
  totalOnuCapacity: number;
  currentOnuCount: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  createdAt: Date;
}

export interface OLTNode {
  id: string;
  clusterId: string;
  name: string;
  ipAddress: string;
  brand: 'ZTE' | 'HUAWEI' | 'VSOL' | 'FIBERHOME' | 'UNKNOWN';
  model: string;
  uplinkPort: string;
  totalPonPorts: number;
  activeOnus: number;
  cpuUsagePercent: number;
  temperatureCelsius: number;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
}

export interface ClusterTopology {
  clusterId: string;
  nodes: any[];
  links: any[];
  lastUpdated: Date;
}

export interface ClusterBalanceReport {
  clusterId: string;
  isBalanced: boolean;
  overloadedNodes: string[];
  underutilizedNodes: string[];
  recommendations: string[];
  aiFailurePredictionRisk: number; // Integrated with AI Service
  generatedAt: Date;
}
