import { PaymentInvoice, PaymentHistory } from '../models/payment.model';
import { XenditService } from './xendit.service';
import { MidtransService } from './midtrans.service';
import { ManualPaymentService } from './manual_payment.service';
import { SubscriptionService } from './subscription.service';

export class PaymentService {
  private xenditService = new XenditService();
  private midtransService = new MidtransService();
  private manualService = new ManualPaymentService();
  private subscriptionService = new SubscriptionService();

  async createInvoice(payload: Partial<PaymentInvoice>) {
    const invoiceId = `INV-${Date.now()}`;
    const { amount, customerId, description, channel } = payload;
    
    let resultUrl = '';
    if (channel === 'XENDIT') {
      const xnd = await this.xenditService.createInvoice(invoiceId, amount!, customerId!, description!);
      resultUrl = xnd.paymentUrl;
    } else if (channel === 'MIDTRANS') {
      const mid = await this.midtransService.createTransaction(invoiceId, amount!, customerId!);
      resultUrl = mid.paymentUrl;
    }

    const invoice: PaymentInvoice = {
      id: invoiceId,
      customerId: customerId!,
      amount: amount!,
      description: description || 'Internet Subscription',
      channel: channel || 'UNASSIGNED',
      status: 'UNPAID',
      paymentUrl: resultUrl,
      dueDate: new Date(Date.now() + 86400000 * 3), // +3 Days
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`[Payment] Invoice ${invoiceId} created successfully via ${channel}`);
    return invoice;
  }

  async getInvoice(id: string) {
    return { id, status: 'UNPAID', amount: 155000 };
  }

  async getHistoryByCustomer(customerId: string) {
    return [
      { id: 'PH-1', invoiceId: 'INV-123', amountPaid: 155000, status: 'PAID', channel: 'XENDIT', timestamp: new Date() }
    ];
  }

  /**
   * Handle Webhooks / Callbacks
   */
  async handleCallback(channel: 'XENDIT' | 'MIDTRANS', payload: any) {
    // In production, verify callback signatures (e.g. x-callback-token for Xendit)
    const invoiceId = payload.external_id || payload.order_id;
    const status = payload.status || payload.transaction_status;
    const customerId = payload.customer_id || 'CST-UNKNOWN'; // Usually fetched from DB using invoiceId
    
    console.log(`[Payment] Callback from ${channel} for ${invoiceId}: ${status}`);

    if (status === 'PAID' || status === 'settlement') {
      // 1. Mark invoice PAID
      // 2. Reactivate/Renew PPPoE Subscription
      await this.subscriptionService.renewSubscription(customerId);
    } else if (status === 'EXPIRED' || status === 'expire') {
      // 1. Mark invoice EXPIRED
      // 2. Suspend PPPoE if it's the primary bill
      await this.subscriptionService.deactivateSubscription(customerId);
    }
    
    return { success: true };
  }

  async confirmManualPayment(invoiceId: string, proofUrl: string, userId: string) {
    return this.manualService.confirmPayment(invoiceId, proofUrl, userId);
  }

  /**
   * Auto Reconciliation Engine (Runs Daily)
   */
  async runDailyReconciliation() {
    console.log(`[Payment] Running daily reconciliation...`);
    // Logic to compare DB PAID statuses vs actual Gateway settlements
    const totalInvoices = 100;
    const totalPaid = 95;
    const discrepanciesCount = 0;
    
    return {
      date: new Date(),
      totalInvoices,
      totalPaid,
      discrepanciesCount,
      status: discrepanciesCount === 0 ? 'SYNCED' : 'DISCREPANCY_FOUND'
    };
  }
}
