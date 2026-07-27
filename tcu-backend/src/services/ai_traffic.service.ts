import { TrafficPrediction, TrafficOptimizationLog } from '../models/ai_traffic.model';
import { AiTrafficTrainingService } from './ai_traffic_training.service';
import { QosService } from './qos.service';
import { NotificationService } from './notification.service';

export class AiTrafficService {
  private trainingService = new AiTrafficTrainingService();
  private qosService = new QosService();
  private notificationService = new NotificationService();

  async getOverview() {
    return {
      totalTrafficAnalyzed: '25.4 TB',
      peakCongestionWindows: ['19:00', '20:00', '21:00'],
      activeAnomalies: 2,
      heavyUsersCount: 15,
      autoOptimizationsApplied: 34
    };
  }

  async predictCustomerTraffic(customerId: string): Promise<TrafficPrediction> {
    const isHeavy = customerId === 'CST-007'; // Simulated heavy user
    return {
      id: `PRED-${Date.now()}`,
      targetId: customerId,
      forecastWindowMs: 3600000,
      predictedDownloadBytes: isHeavy ? 50 * 1024 * 1024 * 1024 : 1 * 1024 * 1024 * 1024, // 50GB vs 1GB
      predictedUploadBytes: 500 * 1024 * 1024,
      congestionProbability: isHeavy ? 0.85 : 0.1,
      heavyUserFlag: isHeavy,
      generatedAt: new Date()
    };
  }

  async getPppoeAnomalies() {
    return [
      { customerId: 'CST-007', anomaly: 'Abusive P2P Torrenting Detected', severity: 'HIGH' },
      { customerId: 'CST-008', anomaly: 'Micro-drops during peak traffic', severity: 'MEDIUM' }
    ];
  }

  async runAutoOptimization() {
    console.log(`[AI-Traffic] Running Auto-Optimization Engine...`);
    
    // Simulate detecting a heavy user causing congestion
    const abusiveUser = 'CST-007';
    const prediction = await this.predictCustomerTraffic(abusiveUser);

    const logs: TrafficOptimizationLog[] = [];

    if (prediction.heavyUserFlag && prediction.congestionProbability > 0.8) {
      console.log(`[AI-Traffic] Congestion detected from ${abusiveUser}. Auto-throttling via QoS...`);
      
      // Integrate with QoS Service to apply throttle
      await this.qosService.applyProfileToCustomer(abusiveUser, 'QOS-2'); // Assume QOS-2 is FUP/Throttled

      // Log the action
      const logEntry: TrafficOptimizationLog = {
        id: `OPT-${Date.now()}`,
        targetId: abusiveUser,
        actionTaken: 'DYNAMIC_QOS_THROTTLE',
        details: 'Throttled abusive traffic to mitigate OLT PON port congestion during peak hour.',
        resolved: true,
        timestamp: new Date()
      };
      logs.push(logEntry);

      // Notify NOC
      await this.notificationService.sendBroadcast({
        title: 'AI Traffic Optimizer',
        body: `Applied dynamic throttle to ${abusiveUser} to prevent network congestion.`,
        telegramChatId: '-100123456',
        channels: ['TELEGRAM']
      });
    }

    return { success: true, optimizedCount: logs.length, logs };
  }

  async retrainModel() {
    return this.trainingService.retrainModel();
  }
}
