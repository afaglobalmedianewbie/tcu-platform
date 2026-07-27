export interface DashboardData {
  kpis: {
    revenue: { value: number; change: number };
    customers: { value: number; change: number };
    tickets: { value: number; change: number };
    outages: { value: number; change: number };
  };
  revenueHistory: { month: string; amount: number; growth: number }[];
  outageHistory: { day: string; count: number }[];
}

export interface NocAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  source: string;
}

export interface TechnicianActivity {
  id: string;
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
  lastTask: string;
  completedTasks: number;
}
