import { MobileDashboardOverview } from '../models/mobile_dashboard.model';
import { CustomerService } from './customer.service';
import crypto from 'crypto';

export class MobileService {
  private customerService = new CustomerService();

  // Simple in-memory cache for mobile dashboard (30 seconds)
  private cache = new Map<string, { timestamp: number, data: MobileDashboardOverview }>();

  async getDashboardData(customerId: string): Promise<MobileDashboardOverview> {
    // Check Cache (30s)
    const cached = this.cache.get(customerId);
    if (cached && (Date.now() - cached.timestamp < 30000)) {
      console.log(`[MobileService] Returning cached dashboard for ${customerId}`);
      return cached.data;
    }

    // Fetch fresh data from underlying customer service
    const fullDashboard = await this.customerService.getDashboardData(customerId);
    
    // Map to Lightweight JSON for Mobile App optimization
    const mobileData: MobileDashboardOverview = {
      user: {
        id: fullDashboard.profile.id || customerId,
        name: fullDashboard.profile.name || 'User',
        status: fullDashboard.profile.status as any || 'ACTIVE'
      },
      network: {
        status: fullDashboard.internetStatus.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
        uptime: fullDashboard.internetStatus.pppoeUptime,
        powerLevel: fullDashboard.internetStatus.onuPowerLevel
      },
      billing: fullDashboard.activeInvoice ? {
        invoiceId: fullDashboard.activeInvoice.id,
        amount: fullDashboard.activeInvoice.amount,
        dueDate: fullDashboard.activeInvoice.dueDate,
        paymentUrl: fullDashboard.activeInvoice.paymentUrl,
        status: fullDashboard.activeInvoice.status
      } : undefined,
      recentTickets: fullDashboard.recentTickets.map(t => ({
        id: t.ticketId,
        status: t.status,
        createdAt: t.createdAt
      }))
    };

    // Store in Cache
    this.cache.set(customerId, { timestamp: Date.now(), data: mobileData });

    return mobileData;
  }

  async getSpeedtestToken(customerId: string) {
    // Generate a short-lived token to authenticate with the ISP's local speedtest server
    // E.g. Librespeed or Ookla custom node
    const token = crypto.randomBytes(16).toString('hex');
    console.log(`[MobileService] Speedtest token generated for ${customerId}`);
    return { token, serverUrl: 'https://speedtest.topclass.id' };
  }

  // Wrapper methods pointing to CustomerService
  async getBilling(customerId: string) { return this.customerService.getCustomerBilling(customerId); }
  async getInvoiceDetail(invoiceId: string) { return this.customerService.getInvoiceDetail(invoiceId); }
  async getTickets(customerId: string) { return this.customerService.getCustomerTickets(customerId); }
  async createTicket(customerId: string, payload: any) { return this.customerService.createTicket(customerId, payload); }
  async getStatus(customerId: string) { 
    const dash = await this.getDashboardData(customerId);
    return dash.network;
  }
  async updateProfile(customerId: string, payload: any) { return this.customerService.updateProfile(customerId, payload); }
}
