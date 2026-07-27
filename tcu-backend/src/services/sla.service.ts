import { SLAPolicy, SLARecord, SLAAlert } from '../models/sla.model';
import { NotificationService } from './notification.service';

export class SlaService {
  private notificationService = new NotificationService();

  // Simulated DB of policies
  private policies: SLAPolicy[] = [
    { id: '1', type: 'TICKET_RESPONSE', maxTimeMinutes: 15, description: 'Ticket response time', isActive: true },
    { id: '2', type: 'TECHNICIAN_ARRIVAL', maxTimeMinutes: 60, description: 'Technician arrival time', isActive: true },
    { id: '3', type: 'WORK_ORDER_COMPLETION', maxTimeMinutes: 180, description: 'Work order completion', isActive: true },
    { id: '4', type: 'CRITICAL_ALERT', maxTimeMinutes: 5, description: 'Critical alerts (ONU offline)', isActive: true },
    { id: '5', type: 'LOW_SIGNAL_ALERT', maxTimeMinutes: 10, description: 'Low signal alerts', isActive: true }
  ];

  async getTicketSla(ticketId: string) {
    // Simulated fetch of SLA records for a ticket
    return [
      { id: 'sla_1', targetId: ticketId, type: 'TICKET_RESPONSE', isViolated: false, startTime: new Date() }
    ];
  }

  async getWorkOrderSla(workOrderId: string) {
    // Simulated fetch of SLA records for a workorder
    return [
      { id: 'sla_2', targetId: workOrderId, type: 'TECHNICIAN_ARRIVAL', isViolated: true, violationDurationMinutes: 12, startTime: new Date() }
    ];
  }

  async getAlerts() {
    // Simulated fetch of unresoived SLA alerts
    return [
      { id: 'alert_1', targetId: 'WO-123', type: 'TECHNICIAN_LATE', message: 'Technician arrival is late by 12 mins', createdAt: new Date(), resolved: false }
    ];
  }

  async updatePolicy(payload: Partial<SLAPolicy>) {
    console.log(`[SLA] Policy ${payload.id || payload.type} updated`);
    // In real app, update DB
    return { success: true, message: 'Policy updated' };
  }

  /**
   * Main Evaluation Engine
   * Can be triggered by cron/background job or specific events
   */
  async evaluateSlas() {
    console.log(`[SLA] Evaluating all active SLAs...`);
    
    // 1. Fetch active open tickets / work orders
    // 2. Compare 'startTime' + policy minutes against 'Date.now()'
    // 3. If exceeded, mark isViolated = true
    
    const violationsFound = 1; // Simulated
    
    if (violationsFound > 0) {
      console.log(`[SLA] Detected ${violationsFound} SLA violations! Triggering alerts.`);
      
      // Send Notification via Broadcast
      await this.notificationService.sendBroadcast({
        title: 'SLA Violation Alert',
        body: 'A technician failed to arrive within the 60 minute window for Work Order WO-123.',
        telegramChatId: process.env.NOC_TELEGRAM_GROUP || '-100123456',
        channels: ['TELEGRAM']
      });

      // Save SLAAlert
    }

    return { success: true, violationsFound };
  }
}
