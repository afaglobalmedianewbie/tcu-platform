export interface Tenant {
  id: string;
  name: string; // e.g. "Lintas Media ISP"
  domain: string; // e.g. "lintasmedia.net"
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantConfig {
  tenantId: string;
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    enableSms: boolean;
    enableAi: boolean;
    maxOlt: number;
    maxCustomers: number;
  };
}

export interface TenantResource {
  tenantId: string;
  resourceType: 'OLT' | 'VPN_SERVER' | 'RADIUS_SERVER';
  resourceIdentifier: string; // e.g. OLT IP or VPN IP allocated to this tenant
  metadata: any;
}

export interface TenantBilling {
  tenantId: string;
  xenditSubAccountId: string; // Integration for XenPlatform
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  monthlyFee: number;
  nextBillingDate: Date;
  isPaid: boolean;
}
