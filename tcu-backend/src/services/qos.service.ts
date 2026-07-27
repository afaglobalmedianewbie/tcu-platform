import { QoSProfile, CustomerQoS } from '../models/qos.model';
import { RadiusQosService } from './radius_qos.service';
import { NotificationService } from './notification.service';

export class QosService {
  private radiusQosService = new RadiusQosService();
  private notificationService = new NotificationService();

  private mockProfiles: QoSProfile[] = [
    { id: 'QOS-1', name: '20M_HOME', downloadRateKbps: 20480, uploadRateKbps: 10240, priority: 8, createdAt: new Date(), updatedAt: new Date() },
    { id: 'QOS-2', name: '50M_FUP', downloadRateKbps: 51200, uploadRateKbps: 25600, priority: 8, fupThresholdBytes: 500 * 1024 * 1024 * 1024, fupDownloadRateKbps: 10240, createdAt: new Date(), updatedAt: new Date() }
  ];

  async createProfile(payload: Partial<QoSProfile>) {
    console.log(`[QoS] Creating Profile: ${payload.name}`);
    const profile: QoSProfile = {
      id: `QOS-${Date.now()}`,
      name: payload.name!,
      downloadRateKbps: payload.downloadRateKbps!,
      uploadRateKbps: payload.uploadRateKbps!,
      burstDownloadKbps: payload.burstDownloadKbps,
      burstUploadKbps: payload.burstUploadKbps,
      priority: payload.priority || 8,
      fupThresholdBytes: payload.fupThresholdBytes,
      fupDownloadRateKbps: payload.fupDownloadRateKbps,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return profile;
  }

  async getProfileList() {
    return this.mockProfiles;
  }

  async updateProfile(id: string, payload: Partial<QoSProfile>) {
    console.log(`[QoS] Updating profile: ${id}`);
    return { success: true, message: 'Profile updated' };
  }

  async deleteProfile(id: string) {
    console.log(`[QoS] Deleting profile: ${id}`);
    return { success: true, message: 'Profile deleted' };
  }

  async applyProfileToCustomer(customerId: string, profileId: string) {
    const profile = this.mockProfiles.find(p => p.id === profileId) || this.mockProfiles[0];
    const username = `user_${customerId}`;
    
    // Inject to Radius
    const result = await this.radiusQosService.applyProfileToRadius(username, profile);
    
    // Force disconnect to apply changes
    await this.radiusQosService.forceReconnect(username);
    
    return { success: true, message: `Profile ${profile.name} applied to ${customerId}` };
  }

  async getCustomerQos(customerId: string): Promise<CustomerQoS> {
    return {
      id: `CQ-${customerId}`,
      customerId,
      profileId: 'QOS-2',
      currentUsageBytes: 450 * 1024 * 1024 * 1024, // 450 GB
      isFupTriggered: false,
      dynamicBoostActive: false,
      lastCalculated: new Date()
    };
  }

  async evaluateFupAndDynamicQos(customerId: string) {
    console.log(`[QoS] Evaluating Dynamic QoS and FUP for ${customerId}...`);
    
    const customerQos = await this.getCustomerQos(customerId);
    const profile = this.mockProfiles.find(p => p.id === customerQos.profileId)!;

    if (profile.fupThresholdBytes && customerQos.currentUsageBytes > profile.fupThresholdBytes && !customerQos.isFupTriggered) {
      console.log(`[QoS] FUP Threshold exceeded for ${customerId}! Throttle speed to ${profile.fupDownloadRateKbps}Kbps.`);
      
      // Throttle user
      const throttledProfile = { ...profile, downloadRateKbps: profile.fupDownloadRateKbps!, uploadRateKbps: profile.fupDownloadRateKbps! };
      await this.radiusQosService.applyProfileToRadius(`user_${customerId}`, throttledProfile);
      await this.radiusQosService.forceReconnect(`user_${customerId}`);
      
      // Notify customer
      await this.notificationService.sendBroadcast({
        title: 'FUP Alert: Speed Reduced',
        body: `You have exceeded your Fair Usage Policy (FUP) limit. Your speed has been temporarily reduced.`,
        customerId,
        channels: ['WHATSAPP', 'EMAIL']
      });

      return { action: 'FUP_APPLIED', newSpeed: profile.fupDownloadRateKbps };
    }

    return { action: 'NO_CHANGES' };
  }
}
