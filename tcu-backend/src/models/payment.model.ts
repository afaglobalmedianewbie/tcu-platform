export interface PaymentInvoice {
  id: string;
  customerId: string;
  amount: number;
  description: string;
  channel: 'XENDIT' | 'MIDTRANS' | 'MANUAL' | 'UNASSIGNED';
  status: 'UNPAID' | 'PAID' | 'EXPIRED' | 'FAILED' | 'PENDING_VERIFICATION';
  paymentUrl?: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentChannel {
  id: string;
  provider: 'XENDIT' | 'MIDTRANS' | 'MANUAL';
  method: 'VIRTUAL_ACCOUNT' | 'EWALLET' | 'RETAIL_OUTLET' | 'BANK_TRANSFER';
  fee: number;
  isActive: boolean;
}

export interface PaymentHistory {
  id: string;
  invoiceId: string;
  customerId: string;
  amountPaid: number;
  channel: string;
  status: string;
  timestamp: Date;
}

export interface ReconciliationLog {
  id: string;
  date: Date;
  totalInvoices: number;
  totalPaid: number;
  discrepanciesCount: number;
  status: 'SYNCED' | 'DISCREPANCY_FOUND';
}
