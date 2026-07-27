import { Tenant, TenantConfig, TenantResource, TenantBilling } from '../models/tenant.model';
import * as crypto from 'crypto';

export class TenantService {

  async createTenant(payload: Partial<Tenant>) {
    console.log(`[Tenant] Provisioning new ISP Tenant: ${payload.name}`);
    
    const tenantId = `TNT-${Date.now()}`;
    const apiKey = crypto.randomBytes(32).toString('hex');

    const tenant: Tenant = {
      id: tenantId,
      name: payload.name!,
      domain: payload.domain!,
      status: 'ACTIVE',
      apiKey,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 1. Create Sub-Account on Xendit XenPlatform
    console.log(`[Tenant] Creating XenPlatform Sub-Account for ${tenant.name}...`);
    const xenditSubAccountId = `xen_${tenantId}`; // Simulated

    // 2. Initialize default configurations
    const config: TenantConfig = {
      tenantId,
      branding: { logoUrl: '', primaryColor: '#0E1A2B', secondaryColor: '#1A2A40' },
      features: { enableSms: false, enableAi: false, maxOlt: 2, maxCustomers: 500 }
    };

    const billing: TenantBilling = {
      tenantId,
      xenditSubAccountId,
      subscriptionPlan: 'BASIC',
      monthlyFee: 1500000,
      nextBillingDate: new Date(Date.now() + 86400000 * 30),
      isPaid: true
    };

    console.log(`[Tenant] Provisioning complete. API Key generated.`);
    return { tenant, config, billing };
  }

  async getTenant(id: string) {
    return {
      id,
      name: 'Lintas Media ISP',
      domain: 'lintasmedia.topclass.id',
      status: 'ACTIVE'
    };
  }

  async getTenantList() {
    return [
      { id: 'TNT-101', name: 'Lintas Media ISP', domain: 'lintasmedia.topclass.id', status: 'ACTIVE' },
      { id: 'TNT-102', name: 'Netizen Fiber', domain: 'netizen.topclass.id', status: 'SUSPENDED' }
    ];
  }

  async updateTenant(id: string, payload: Partial<Tenant>) {
    console.log(`[Tenant] Updating tenant ${id}`);
    return { success: true, message: 'Tenant updated successfully' };
  }

  async suspendTenant(id: string) {
    console.log(`[Tenant] Suspending tenant ${id}. All OLTs and Radius access will be blocked.`);
    // 1. Mark status = SUSPENDED
    // 2. Disable Radius Auth for this tenant ID
    // 3. Drop active PPPoE sessions
    return { success: true, message: 'Tenant suspended successfully' };
  }

  async activateTenant(id: string) {
    console.log(`[Tenant] Activating tenant ${id}.`);
    return { success: true, message: 'Tenant activated successfully' };
  }
}
