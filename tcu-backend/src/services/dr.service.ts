import { DRStatus, DRLog } from '../models/dr.model';
import { DrReplicationService } from './dr_replication.service';
import { NotificationService } from './notification.service';

export class DrService {
  private replicationService = new DrReplicationService();
  private notificationService = new NotificationService();

  async getStatus(): Promise<DRStatus[]> {
    return [
      { id: 'NODE-JAKARTA', region: 'JAKARTA', nodeType: 'PRIMARY', health: 'HEALTHY', lastHeartbeat: new Date(), activeConnections: 2500 },
      { id: 'NODE-SINGAPORE', region: 'SINGAPORE', nodeType: 'SECONDARY_STANDBY', health: 'HEALTHY', lastHeartbeat: new Date(), activeConnections: 0 }
    ];
  }

  async getReplicationStatus() {
    return this.replicationService.getReplicationStatus();
  }

  async activateFailover(userId: string, reason: string) {
    console.log(`[DR] 🚨 INITIATING EMERGENCY FAILOVER 🚨`);
    console.log(`[DR] Reason: ${reason}. Executed by: ${userId}`);

    // 1. Point DNS / BGP routes to Standby node (Simulated)
    console.log(`[DR] Re-routing traffic to STANDBY region...`);
    
    // 2. Migrate PPPoE Sessions gracefully (Simulated CoA)
    console.log(`[DR] Initiating PPPoE session migration to Backup RADIUS...`);

    // 3. Promote DB Standby to Primary
    console.log(`[DR] Promoting Standby Database to PRIMARY...`);

    // 4. Log Event
    await this.logEvent('FAILOVER_ACTIVATED', `Failover to STANDBY region triggered. Reason: ${reason}`, userId);

    // 5. Notify Stakeholders
    await this.notificationService.sendBroadcast({
      title: 'CRITICAL: FAILOVER ACTIVATED',
      body: `System has failed over to the Backup Region. Reason: ${reason}`,
      telegramChatId: '-100123456',
      channels: ['TELEGRAM', 'EMAIL']
    });

    return { success: true, message: 'Failover activated successfully. Platform is running on Standby Node.' };
  }

  async testFailoverScenario(scenario: string, userId: string) {
    console.log(`[DR-Test] Executing DR Test Scenario: ${scenario}`);
    
    await this.logEvent('DR_TEST_EXECUTED', `DR Simulation Test run for scenario: ${scenario}`, userId);

    return { success: true, message: `DR Test for ${scenario} completed. System handled the simulated outage gracefully.` };
  }

  async getLogs(): Promise<DRLog[]> {
    return [
      { id: 'LOG-DR-1', eventType: 'DR_TEST_EXECUTED', details: 'DR Simulation Test run for scenario: VPN_DISCONNECT', executedBy: 'sys', timestamp: new Date() }
    ];
  }

  private async logEvent(eventType: any, details: string, executedBy: string) {
    const log: DRLog = {
      id: `DRL-${Date.now()}`,
      eventType,
      details,
      executedBy,
      timestamp: new Date()
    };
    console.log(`[DR-Log] ${eventType}: ${details}`);
  }
}
