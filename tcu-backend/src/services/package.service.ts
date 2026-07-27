import { Package } from '../models/package.model';

export class PackageService {
  
  async createPackage(payload: Partial<Package>) {
    console.log(`[Package] Creating package: ${payload.name}`);
    const pkg: Package = {
      id: `PKG-${Date.now()}`,
      name: payload.name!,
      speedMbps: payload.speedMbps!,
      quotaBytes: payload.quotaBytes,
      price: payload.price!,
      billingCycle: payload.billingCycle || 'MONTHLY',
      description: payload.description || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return pkg;
  }

  async getPackageList() {
    return [
      { id: 'PKG-1', name: 'Home Basic 20Mbps', speedMbps: 20, price: 155000, billingCycle: 'MONTHLY' },
      { id: 'PKG-2', name: 'Home Pro 50Mbps', speedMbps: 50, price: 255000, billingCycle: 'MONTHLY' }
    ];
  }

  async getPackage(id: string) {
    return { id, name: 'Home Basic 20Mbps', speedMbps: 20, price: 155000, billingCycle: 'MONTHLY' };
  }

  async updatePackage(id: string, payload: Partial<Package>) {
    console.log(`[Package] Updating package: ${id}`);
    return { success: true, message: 'Package updated' };
  }

  async deletePackage(id: string) {
    console.log(`[Package] Soft deleting package: ${id}`);
    return { success: true, message: 'Package deleted' };
  }
}
