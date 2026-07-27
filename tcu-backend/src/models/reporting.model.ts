export interface RevenueReport {
  period: string; // e.g. "2026-07-16" or "2026-07"
  totalRevenue: number;
  arpu: number;
  mrr: number;
  bepStatus: boolean;
}

export interface CustomerGrowth {
  periodMonth: string;
  newCustomers: number;
  activeCount: number;
  suspendedCount: number;
  coverageDistribution: Record<string, number>;
}

export interface ChurnReport {
  periodMonth: string;
  churnRatePercent: number;
  lostCustomers: number;
}

export interface NetworkUptime {
  oltId: string;
  uptimePercentage: number;
  outageMinutes: number;
}

export interface SignalQuality {
  oltId: string;
  greenCount: number; // -15 to -25
  yellowCount: number; // -25 to -28
  redCount: number; // below -28
  offlineCount: number;
}

export interface TechnicianPerformance {
  technicianId: string;
  totalWorkOrders: number;
  avgCompletionTimeHours: number;
  slaCompliancePercent: number;
  ticketResolutionRatePercent: number;
}
