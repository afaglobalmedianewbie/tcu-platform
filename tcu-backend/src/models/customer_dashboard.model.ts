import { Customer, CustomerBilling, CustomerTicket } from './crm.model';

export interface CustomerDashboardOverview {
  profile: Partial<Customer>;
  internetStatus: {
    status: 'ONLINE' | 'OFFLINE' | 'SUSPENDED';
    pppoeUptime?: string;
    ipAddress?: string;
    onuPowerLevel?: string;
  };
  activeInvoice?: {
    id: string;
    amount: number;
    dueDate: Date;
    paymentUrl: string;
    status: string;
  };
  recentTickets: CustomerTicket[];
}
