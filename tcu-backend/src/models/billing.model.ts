export interface BillingInvoice {
  id: string;
  customerId: string;
  amount: number;
  description: string;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  xenditInvoiceId?: string;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingHistory {
  id: string;
  invoiceId: string;
  customerId: string;
  action: string;
  description: string;
  timestamp: Date;
}

export interface CustomerStatus {
  customerId: string;
  status: 'ACTIVE' | 'SUSPENDED';
  radiusUsername: string;
  lastUpdated: Date;
}
