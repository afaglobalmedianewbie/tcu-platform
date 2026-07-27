import { GenieAcsService } from './genieacs.service';
import { ProvisionDevice, ProvisionLog } from '../models/provision.model';

export class ProvisionService {
  private acsService = new GenieAcsService();

  async getDevice(serialNumber: string) {
    return this.acsService.getDevice(serialNumber);
  }

  async provisionOnu(payload: any, userId: string) {
    const { serialNumber, customerId, vlan } = payload;
    console.log(`[Provision] Provisioning ONU ${serialNumber} for customer ${customerId}`);
    
    // 1. Fetch from ACS
    const device = await this.acsService.getDevice(serialNumber);
    
    // 2. Map PPPoE credentials
    const pppoeUser = `user_${customerId}`;
    const pppoePass = 'secret123';
    
    // 3. Push WAN PPPoE params
    await this.acsService.setPppoeWan(device.acsId, pppoeUser, pppoePass, vlan || 100);

    // 4. (Optional) SNMP logic for T-CONT & GEM-Port would be called here via SnmpService
    // await this.snmpService.configureOnu(...)

    this.logAction(device.acsId, 'PROVISION_WAN', 'SUCCESS', userId);

    return { success: true, message: 'ONU Provisioned successfully' };
  }

  async provisionRouter(payload: any, userId: string) {
    // Similar to ONU but often strictly WiFi/PPPoE without PON logic
    return this.provisionOnu(payload, userId);
  }

  async applyProfile(payload: any, userId: string) {
    const { serialNumber, profileId } = payload;
    console.log(`[Provision] Applying profile ${profileId} to ${serialNumber}`);
    return { success: true, message: 'Profile applied' };
  }

  async updateWifi(payload: any, userId: string) {
    const { serialNumber, ssid, password } = payload;
    const device = await this.acsService.getDevice(serialNumber);
    await this.acsService.setWifi(device.acsId, ssid, password);
    this.logAction(device.acsId, 'PROVISION_WIFI', 'SUCCESS', userId);
    return { success: true, message: 'WiFi parameters updated' };
  }

  async updateWan(payload: any, userId: string) {
    const { serialNumber, ipAddress, netmask, gateway } = payload; // For Static IP
    console.log(`[Provision] Updating WAN (Static IP) for ${serialNumber}`);
    // Simulate push
    return { success: true, message: 'WAN parameters updated' };
  }

  async rebootDevice(serialNumber: string, userId: string) {
    const device = await this.acsService.getDevice(serialNumber);
    await this.acsService.rebootDevice(device.acsId);
    this.logAction(device.acsId, 'REBOOT', 'SUCCESS', userId);
    return { success: true, message: 'Device reboot initiated' };
  }

  private logAction(deviceId: string, action: string, status: string, recordedBy: string) {
    const log: ProvisionLog = {
      id: `prov_log_${Date.now()}`,
      deviceId,
      action: action as any,
      status: status as any,
      recordedBy,
      timestamp: new Date()
    };
    console.log(`[ProvisionLog] ${action} on ${deviceId} -> ${status} by ${recordedBy}`);
  }
}
