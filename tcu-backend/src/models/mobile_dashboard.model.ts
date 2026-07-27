export interface MobileDashboardOverview {
  user: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  };
  network: {
    status: 'ONLINE' | 'OFFLINE';
    uptime?: string;
    powerLevel?: string;
  };
  billing?: {
    invoiceId: string;
    amount: number;
    dueDate: Date;
    paymentUrl: string;
    status: string;
  };
  recentTickets: Array<{
    id: string;
    status: string;
    createdAt: Date;
  }>;
}
