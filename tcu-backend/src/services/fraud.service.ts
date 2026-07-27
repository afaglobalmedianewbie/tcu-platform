import { FraudScore, FraudAlert, FraudNetworkEvent } from '../models/fraud.model';
import { RadiusService } from './radius.service';
import { NotificationService } from './notification.service';

export class FraudService {
  private radiusService = new RadiusService();
  private notificationService = new NotificationService();

  async getCustomerScore(customerId: string): Promise<FraudScore> {
    // Simulated DB fetch
    return {
      customerId,
      score: 15,
      riskLevel: 'LOW',
      lastEvaluated: new Date(),
      factors: [
        { category: 'BILLING', reason: 'Late payment 1 time', points: 15 }
      ]
    };
  }

  async getAlerts(): Promise<FraudAlert[]> {
    return [
      { id: 'FA-1', customerId: 'CST-002', category: 'NETWORK', description: 'MAC Address spoofing detected', severity: 'HIGH', actionTaken: 'AUTO_SUSPEND', resolved: false, createdAt: new Date() }
    ];
  }

  async getNetworkAnomalies(): Promise<FraudNetworkEvent[]> {
    return [
      { id: 'FNE-1', customerId: 'CST-002', type: 'MAC_SPOOFING', details: 'Multiple MACs on single ONT port', timestamp: new Date() }
    ];
  }

  async verifyIdentity(payload: any) {
    const { customerId, ktpData } = payload;
    console.log(`[Fraud] Verifying identity for ${customerId}...`);
    // Simulated KYC or duplicate check
    return { success: true, isVerified: true, message: 'Identity verified successfully. No duplicates found.' };
  }

  /**
   * Main Fraud Evaluation Engine
   */
  async evaluateCustomer(customerId: string) {
    console.log(`[Fraud] Evaluating risk score for ${customerId}`);
    
    // Simulate aggregating points
    // Rule 1: Billing (e.g. multiple unpaid invoices = +40)
    // Rule 2: Identity (e.g. mismatched KTP = +50)
    // Rule 3: Network (e.g. abnormal bandwidth spikes = +30)
    
    const simulatedScore = 85; 
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    if (simulatedScore > 70) riskLevel = 'HIGH';
    else if (simulatedScore > 30) riskLevel = 'MEDIUM';

    if (riskLevel === 'HIGH') {
      console.log(`[Fraud] HIGH RISK DETECTED for ${customerId}. Taking auto-actions.`);
      
      // Auto-Suspend PPPoE
      const pppoeUser = `user_${customerId}`;
      await this.radiusService.suspendUser(pppoeUser);

      // Auto-Notify NOC and Finance
      await this.notificationService.sendBroadcast({
        title: 'FRAUD ALERT',
        body: `High risk detected for Customer ${customerId} (Score: ${simulatedScore}). Account has been auto-suspended.`,
        telegramChatId: '-100123456',
        channels: ['TELEGRAM', 'EMAIL'],
        email: 'finance@topclass.id'
      });
    }

    return {
      customerId,
      score: simulatedScore,
      riskLevel,
      actionTaken: riskLevel === 'HIGH' ? 'AUTO_SUSPEND_AND_NOTIFY' : 'NONE'
    };
  }
}
