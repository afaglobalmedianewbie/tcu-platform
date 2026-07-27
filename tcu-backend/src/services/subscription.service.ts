import { Subscription, SubscriptionHistory } from '../models/subscription.model';
import { RadiusService } from './radius.service';
import { BillingService } from './billing.service';

export class SubscriptionService {
  private radiusService = new RadiusService();
  private billingService = new BillingService();

  async activateSubscription(customerId: string, packageId: string) {
    console.log(`[Subscription] Activating package ${packageId} for customer ${customerId}`);
    
    // In a real app, fetch package speed profile
    const profile = '20M_PROFILE'; 
    const pppoeUser = `user_${customerId}`;
    const pppoePass = 'secret123';

    // 1. Create PPPoE Profile via RADIUS
    await this.radiusService.createPppoeAccount(pppoeUser, pppoePass, profile);

    // 2. Setup recurring billing in Xendit / Billing Service
    // Simulate setting next billing date
    
    return { success: true, message: 'Subscription activated' };
  }

  async deactivateSubscription(customerId: string) {
    console.log(`[Subscription] Deactivating subscription for customer ${customerId}`);
    
    const pppoeUser = `user_${customerId}`;
    // 1. Remove PPPoE Account
    await this.radiusService.deletePppoeAccount(pppoeUser);

    return { success: true, message: 'Subscription deactivated' };
  }

  async getCustomerSubscription(customerId: string) {
    // Simulate DB fetch
    return {
      id: `SUB-${customerId}`,
      customerId,
      packageId: 'PKG-1',
      status: 'ACTIVE',
      nextBillingDate: new Date(Date.now() + 86400000 * 15) // +15 days
    };
  }

  async renewSubscription(customerId: string) {
    console.log(`[Subscription] Auto-renewing subscription for ${customerId}`);
    // This is typically called by a Webhook from Billing Engine when an invoice is PAID
    // Update nextBillingDate + 1 month
    return { success: true, message: 'Subscription renewed' };
  }
}
