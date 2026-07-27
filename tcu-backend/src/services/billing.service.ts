import { XenditService } from './xendit.service';
import { RadiusService } from './radius.service';
import { BillingInvoice, BillingHistory } from '../models/billing.model';
import crypto from 'crypto';

export class BillingService {
  private xenditService = new XenditService();
  private radiusService = new RadiusService();

  async createInvoice(customerId: string, amount: number, description: string, dueDate: Date) {
    const externalId = `INV-${customerId}-${Date.now()}`;
    
    // Call Xendit
    const xenditRes = await this.xenditService.createInvoice({
      externalId,
      amount,
      description,
      dueDate
    });

    // Save to DB (Simulated)
    const invoice: BillingInvoice = {
      id: externalId,
      customerId,
      amount,
      description,
      dueDate,
      status: 'PENDING',
      xenditInvoiceId: xenditRes.invoice_id,
      paymentUrl: xenditRes.payment_url,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return invoice;
  }

  async getInvoice(invoiceId: string) {
    // Fetch from DB (Simulated)
    return {
      id: invoiceId,
      status: 'PENDING',
      paymentUrl: 'https://checkout.xendit.co/web/mock',
    };
  }

  async handleXenditCallback(payload: any) {
    const { external_id, status } = payload;
    
    // Logic based on status
    if (status === 'PAID' || status === 'SETTLED') {
      console.log(`[Billing] Invoice ${external_id} paid.`);
      // 1. Update invoice status to PAID
      // 2. Fetch customer's radius username
      // 3. Reactivate user
      await this.radiusService.reactivateUser(`user_${external_id.split('-')[1]}`);
      
    } else if (status === 'EXPIRED') {
      console.log(`[Billing] Invoice ${external_id} expired.`);
      // 1. Update invoice status to EXPIRED
      // 2. Suspend user
      await this.radiusService.suspendUser(`user_${external_id.split('-')[1]}`);
    }
    
    // Save to BillingHistory (Simulated)
    return { success: true };
  }

  async getCustomerHistory(customerId: string) {
    // Fetch from DB (Simulated)
    return [
      { id: '1', invoiceId: 'INV-123', customerId, action: 'CREATED', timestamp: new Date() }
    ];
  }

  async suspendCustomer(customerId: string) {
    const radiusUsername = `user_${customerId}`; // Mock mapping
    await this.radiusService.suspendUser(radiusUsername);
    return { success: true, message: `Customer ${customerId} suspended.` };
  }

  async reactivateCustomer(customerId: string) {
    const radiusUsername = `user_${customerId}`;
    await this.radiusService.reactivateUser(radiusUsername);
    return { success: true, message: `Customer ${customerId} reactivated.` };
  }
}
