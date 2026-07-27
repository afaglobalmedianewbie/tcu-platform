import { RadiusService } from './radius.service';
import { Customer, CustomerService } from '../models/crm.model';

export class CrmService {
  private radiusService = new RadiusService();

  async createCustomer(payload: any) {
    const customerId = `CST-${Date.now()}`;
    const customer: Customer = {
      id: customerId,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      geolocation: payload.geolocation,
      coverageArea: payload.coverageArea,
      status: 'PROSPECT',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log(`[CRM] Customer ${customerId} created`);
    return customer;
  }

  async getCustomer(customerId: string) {
    // Simulated DB fetch
    return {
      id: customerId,
      name: 'John Doe',
      status: 'ACTIVE',
      coverageArea: 'PANGANDARAN'
    };
  }

  async updateCustomer(customerId: string, payload: any) {
    console.log(`[CRM] Customer ${customerId} updated`);
    return { success: true, message: 'Customer updated' };
  }

  async activateCustomer(customerId: string, servicePayload: any) {
    // 1. Map ONU to OLT
    // 2. Create PPPoE Account in RADIUS
    // 3. Update Status to ACTIVE
    const pppoeUser = servicePayload.pppoeUsername || `user_${customerId}`;
    const pppoePass = servicePayload.pppoePassword || 'secret123';
    
    await this.radiusService.createPppoeAccount(pppoeUser, pppoePass, servicePayload.serviceProfile || 'DEFAULT_FIBER');
    
    console.log(`[CRM] Customer ${customerId} activated on OLT ${servicePayload.oltId} (ONU: ${servicePayload.onuSerial})`);
    
    return { success: true, message: `Customer ${customerId} activated and PPPoE created.` };
  }

  async deactivateCustomer(customerId: string) {
    // 1. Delete PPPoE Account in RADIUS
    // 2. Update Status to INACTIVE
    const pppoeUser = `user_${customerId}`;
    await this.radiusService.deletePppoeAccount(pppoeUser);
    
    console.log(`[CRM] Customer ${customerId} deactivated.`);
    return { success: true, message: `Customer ${customerId} deactivated.` };
  }

  async getCustomerServices(customerId: string) {
    return [
      {
        id: `SRV-${customerId}-1`,
        serviceType: 'INTERNET_FIBER',
        pppoeUsername: `user_${customerId}`,
        oltId: 'OLT_PADAHERANG',
        onuSerial: 'ALL-ONT-9382',
        activatedAt: new Date()
      }
    ];
  }

  async getCustomerBilling(customerId: string) {
    // Integrate with Billing Service logic or DB
    return {
      customerId,
      currentBillingStatus: 'PAID',
      monthlyFee: 155000
    };
  }

  async getCustomerTickets(customerId: string) {
    // Integrate with Ticket Service logic or DB
    return [
      { ticketId: 'TKT-12345', status: 'CLOSED', category: 'INTERNET_DOWN', createdAt: new Date() }
    ];
  }
}
