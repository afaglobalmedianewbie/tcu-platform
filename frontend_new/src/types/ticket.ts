export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'TEKNIS' | 'ADMINISTRASI' | 'BILLING';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'PROCESSING' | 'RESOLVED';
  assignedTo?: string;
  slaLimit: string; // ISO date string or limit in minutes
  createdAt: string;
}
