import { CustomerDashboardOverview } from '../models/customer_dashboard.model';
import { BillingService } from './billing.service';
import { TicketService } from './ticket.service';
import { SnmpService } from './snmp.service';
// Note: RadiusService interactions for active sessions could be imported here

export class CustomerService {
  private billingService = new BillingService();
  private ticketService = new TicketService();
  private snmpService = new SnmpService();

  async getDashboardData(customerId: string): Promise<CustomerDashboardOverview> {
    // 1. Fetch Profile
    const profile = {
      id: customerId,
      name: 'John Doe',
      address: 'Jl. Contoh 123',
      phone: '08123456789',
      status: 'ACTIVE' as const
    };

    // 2. Fetch Internet Status via SNMP & Radius Logic
    // Simulating OLT SNMP fetch for customer's ONU
    const onuData = await this.snmpService.getOnuDetail('172.29.205.62', 'tcuro', 'gpon-onu_0/1/18');
    
    // 3. Fetch active invoice
    const activeInvoice = {
      id: 'INV-12345',
      amount: 155000,
      dueDate: new Date(Date.now() + 86400000 * 3), // +3 days
      paymentUrl: 'https://checkout.xendit.co/web/mock',
      status: 'UNPAID'
    };

    // 4. Fetch recent tickets
    const tickets = await this.ticketService.getTicketsByCustomer(customerId);

    return {
      profile,
      internetStatus: {
        status: profile.status === 'SUSPENDED' ? 'SUSPENDED' : 'ONLINE',
        pppoeUptime: '15d 3h 2m', // From RADIUS simulated
        ipAddress: '10.8.0.45', // From RADIUS simulated
        onuPowerLevel: onuData.powerRxOlt
      },
      activeInvoice,
      recentTickets: tickets.slice(0, 3) as any // Top 3
    };
  }

  async updateProfile(customerId: string, payload: any) {
    console.log(`[Customer] Profile updated for ${customerId}`);
    // Simulate DB Update
    return { success: true, message: 'Profile updated' };
  }

  async getCustomerBilling(customerId: string) {
    return this.billingService.getCustomerHistory(customerId);
  }

  async getInvoiceDetail(invoiceId: string) {
    return this.billingService.getInvoice(invoiceId);
  }

  async getCustomerTickets(customerId: string) {
    return this.ticketService.getTicketsByCustomer(customerId);
  }

  async createTicket(customerId: string, payload: any) {
    return this.ticketService.createTicket({ 
      customerId, 
      category: payload.category, 
      description: payload.description, 
      priority: payload.priority 
    }, customerId);
  }
}
