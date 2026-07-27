export interface ConfigTemplate {
  id: string;
  name: string;
  target: 'GENIEACS' | 'FREERADIUS' | 'POSTFIX' | 'DOVECOT';
  content: string;
  updatedAt: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  templateName: string;
  target: string;
  status: 'SUCCESS' | 'FAILED' | 'ROLLBACKED';
  operator: string;
  details: string;
}
