export interface DRStatus {
  id: string;
  region: string;
  nodeType: 'PRIMARY' | 'SECONDARY_STANDBY';
  health: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  lastHeartbeat: Date;
  activeConnections: number;
}

export interface DRReplicationStatus {
  id: string;
  sourceRegion: string;
  targetRegion: string;
  syncStatus: 'SYNCED' | 'LAGGING' | 'BROKEN';
  lagSeconds: number;
  lastSuccessfulSync: Date;
  conflictResolvedCount: number;
}

export interface DRLog {
  id: string;
  eventType: 'FAILOVER_ACTIVATED' | 'REPLICATION_BROKEN' | 'DR_TEST_EXECUTED' | 'NODE_RECOVERED';
  details: string;
  executedBy: string;
  timestamp: Date;
}
