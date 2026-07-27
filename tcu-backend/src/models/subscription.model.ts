export interface Subscription {
  id: string;
  customerId: string;
  packageId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED' | 'PENDING';
  startDate: Date;
  nextBillingDate: Date;
  autoRenew: boolean;
}

export interface SubscriptionHistory {
  id: string;
  subscriptionId: string;
  action: 'ACTIVATED' | 'SUSPENDED' | 'REACTIVATED' | 'RENEWED' | 'CANCELED';
  notes: string;
  timestamp: Date;
}
