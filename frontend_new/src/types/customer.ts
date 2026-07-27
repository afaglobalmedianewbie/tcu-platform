export interface CustomerDashboardData {
  customerName: string;
  pppoeUsername: string;
  internetStatus: 'ONLINE' | 'OFFLINE' | 'ISOLATED';
  onuSignal: {
    rxPower: number; // dBm
    status: 'EXCELLENT' | 'GOOD' | 'POOR' | 'LOS';
  };
  activeInvoice: {
    invoiceId: string;
    amount: number;
    dueDate: string;
    status: 'UNPAID' | 'PAID';
  } | null;
  subscription: {
    planName: string;
    speedLimit: string; // Mbps
    price: number;
    renewalDate: string;
  };
  tickets: {
    id: string;
    category: string;
    subject: string;
    status: 'OPEN' | 'PROCESSING' | 'RESOLVED';
    createdAt: string;
  }[];
}

export interface SpeedtestResult {
  ping: number;
  download: number; // Mbps
  upload: number; // Mbps
}
