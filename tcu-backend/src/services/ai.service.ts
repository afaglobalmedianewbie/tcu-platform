import { PredictiveRiskScore, PredictiveAlert } from '../models/ai.model';
import { AiTrainingService } from './ai_training.service';
import { NotificationService } from './notification.service';

export class AiService {
  private trainingService = new AiTrainingService();
  private notificationService = new NotificationService();

  async predictOnu(onuId: string): Promise<PredictiveRiskScore> {
    // Simulating inference calculation from model
    const riskScore = 85; 
    
    if (riskScore > 80) {
      this.generateAlert('gpon-onu_0/1/15', 'HIGH_RISK_ONU', 'ONU is highly likely to experience a Loss of Signal in the next 24 hours based on recent degradation patterns.', riskScore);
    }

    return {
      targetId: onuId,
      type: 'ONU',
      score: riskScore,
      probabilities: {
        lowSignalProbability: 0.88,
        offlineProbability: 0.92,
        hardwareFailureProbability: 0.12
      },
      lastEvaluated: new Date()
    };
  }

  async predictOlt(oltId: string): Promise<PredictiveRiskScore> {
    return {
      targetId: oltId,
      type: 'OLT',
      score: 15,
      probabilities: {
        hardwareFailureProbability: 0.05
      },
      lastEvaluated: new Date()
    };
  }

  async predictCustomer(customerId: string): Promise<PredictiveRiskScore> {
    // Simulating churn prediction based on PPPoE drops and Ticket history
    const riskScore = 65;
    return {
      targetId: customerId,
      type: 'CUSTOMER',
      score: riskScore,
      probabilities: {
        pppoeDropProbability: 0.70,
        churnProbability: 0.65
      },
      lastEvaluated: new Date()
    };
  }

  async getAlerts(): Promise<PredictiveAlert[]> {
    return [
      {
        id: 'AI-A-1',
        targetId: 'gpon-onu_0/1/15',
        type: 'HIGH_RISK_ONU',
        message: 'AI predicts 92% chance of ONU going offline within 24 hours.',
        riskScore: 92,
        resolved: false,
        createdAt: new Date()
      },
      {
        id: 'AI-A-2',
        targetId: 'CST-404',
        type: 'CHURN_PREDICTION',
        message: 'Customer has 65% churn risk due to repeated PPPoE drops this week.',
        riskScore: 65,
        resolved: false,
        createdAt: new Date()
      }
    ];
  }

  async trainModel() {
    return this.trainingService.trainModel();
  }

  async retrainModel() {
    return this.trainingService.retrainModel();
  }

  private async generateAlert(targetId: string, type: 'HIGH_RISK_ONU' | 'OLT_OVERHEATING' | 'PPPOE_INSTABILITY' | 'CHURN_PREDICTION', message: string, score: number) {
    // Save to DB and broadcast
    console.log(`[AI-Predict] Alert Generated for ${targetId}: ${message}`);
    
    // Auto-notify NOC
    await this.notificationService.sendBroadcast({
      title: `AI Predictive Alert: ${type}`,
      body: `${message} (Risk Score: ${score})`,
      telegramChatId: '-100123456',
      channels: ['TELEGRAM']
    });
  }
}
