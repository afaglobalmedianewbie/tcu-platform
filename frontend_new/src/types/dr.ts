export interface DRNode {
  id: string;
  region: string;
  status: 'ACTIVE' | 'STANDBY' | 'OFFLINE';
  traffic: string;
  ping: string;
  dbLag: string;
}

export interface DRStatus {
  replicationStatus: 'SYNCED' | 'LAGGING' | 'FAILED' | 'BROKEN';
  nodes: DRNode[];
  lastFailoverTime?: string;
}

export interface DRLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  operator: string;
}
