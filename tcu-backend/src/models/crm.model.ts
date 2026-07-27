export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  geolocation?: string;
  coverageArea: string;
  status: 'PROSPECT' | 'INSTALLATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerService {
  id: string;
  customerId: string;
  pppoeUsername?: string;
  pppoePassword?: string;
  oltId?: string;
  onuSerial?: string;
  onuInterface?: string;
  serviceType: 'INTERNET_FIBER' | 'DIGITAL_SERVICES' | 'IOT';
  activatedAt?: Date;
}

export interface CustomerBilling {
  customerId: string;
  currentBillingStatus: 'PAID' | 'UNPAID' | 'OVERDUE';
  activeInvoiceId?: string;
  monthlyFee: number;
}

export interface CustomerTicket {
  ticketId: string;
  customerId: string;
  status: string;
  createdAt: Date;
}
