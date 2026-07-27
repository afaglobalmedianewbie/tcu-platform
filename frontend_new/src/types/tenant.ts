export interface TenantResource {
  activePppoeCount: number;
  maxPppoeCount: number;
  activeOnuCount: number;
  maxOnuCount: number;
  bandwidthUsageGbps: number;
  bandwidthCapGbps: number;
}

export interface TenantBillingInfo {
  planName: string;
  nextRenewalDate: string;
  monthlyCost: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'SUSPENDED';
}

export interface Tenant {
  id: string;
  companyName: string;
  domain: string;
  adminEmail: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  resources: TenantResource;
  billing: TenantBillingInfo;
}
