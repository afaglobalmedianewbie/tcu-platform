export type ConfigType = 'OLT' | 'ONU' | 'ROUTER' | 'QOS' | 'VPN' | 'ACS';

export interface ConfigTemplate {
  id: string;
  name: string;
  type: ConfigType;
  version: number;
  payload: string; // JSON String or CLI Template syntax
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigVersion {
  id: string;
  templateId: string;
  version: number;
  payload: string;
  changesDiff: string;
  createdAt: Date;
}

export interface ConfigExecution {
  id: string;
  templateId: string;
  targetId: string; // Device ID, Customer ID, or Cluster ID
  status: 'PENDING' | 'VALIDATING' | 'EXECUTING' | 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  executionLogs: string[];
  executedAt: Date;
}

export interface ConfigRollback {
  id: string;
  executionId: string;
  targetId: string;
  previousPayloadSnapshot: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  executedAt: Date;
}
