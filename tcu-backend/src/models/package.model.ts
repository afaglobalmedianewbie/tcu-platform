export interface Package {
  id: string;
  name: string;
  speedMbps: number;
  quotaBytes?: number; // Optional, null means unlimited
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
