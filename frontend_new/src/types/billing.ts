export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'EXPIRED' | 'REFUNDED';
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  planName: string;
  billingPeriod: string;
}

export interface SettlementReport {
  totalRevenue: number;
  paidCount: number;
  unpaidCount: number;
  settlementRate: number; // percentage
}
