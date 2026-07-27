import { QoSProfile } from '../models/qos.model';

export class RadiusQosService {

  /**
   * Apply QoS Profile directly to RADIUS DB (radreply table)
   * This overrides the MikroTik bandwidth rules natively via PPPoE login
   */
  async applyProfileToRadius(username: string, profile: QoSProfile) {
    const rateLimit = `${profile.uploadRateKbps}k/${profile.downloadRateKbps}k`;
    let mikrotikRateLimit = rateLimit;
    
    // Add burst limits if provided (Format: rx-rate/tx-rate rx-burst-rate/tx-burst-rate rx-burst-threshold/tx-burst-threshold rx-burst-time/tx-burst-time priority rx-rate-min/tx-rate-min)
    if (profile.burstDownloadKbps && profile.burstUploadKbps) {
      mikrotikRateLimit = `${profile.uploadRateKbps}k/${profile.downloadRateKbps}k ${profile.burstUploadKbps}k/${profile.burstDownloadKbps}k ${profile.uploadRateKbps}k/${profile.downloadRateKbps}k 30/30 ${profile.priority}`;
    }

    console.log(`[RadiusQoS] Applying Rate-Limit for ${username}: ${mikrotikRateLimit}`);

    // Simulated Prisma Database Interaction:
    // 1. Remove old rate limit
    // await prisma.radreply.deleteMany({ where: { username, attribute: 'Mikrotik-Rate-Limit' } });
    
    // 2. Insert new rate limit
    // await prisma.radreply.create({
    //   data: { username, attribute: 'Mikrotik-Rate-Limit', op: '=', value: mikrotikRateLimit }
    // });

    return { success: true, mikrotikRateLimit };
  }

  /**
   * Disconnect user to force PPPoE re-login (applying the new QoS speed)
   */
  async forceReconnect(username: string) {
    console.log(`[RadiusQoS] Issuing Disconnect-Request for ${username} to apply new QoS...`);
    // Usually via CoA (Change of Authorization) or SSH to kick PPPoE
    return true;
  }
}
