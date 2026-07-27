import { EventType, EventLog, EventSubscriber } from '../models/event.model';
import { EventQueueService } from './eventqueue.service';

export class EventBusService {
  private queueService = new EventQueueService();
  private eventLogs: EventLog[] = [];
  
  // Mocked subscribers list
  private subscribers: EventSubscriber[] = [
    { id: 'SUB-1', name: 'NotificationService', eventTypes: ['billing.invoice.paid', 'monitoring.onu.offline', 'security.threat.detected'], isActive: true },
    { id: 'SUB-2', name: 'CrmSyncService', eventTypes: ['billing.invoice.paid', 'qos.profile.applied'], isActive: true },
    { id: 'SUB-3', name: 'AiPredictiveService', eventTypes: ['monitoring.signal.low', 'ticket.created'], isActive: true }
  ];

  async getSubscribers() {
    return this.subscribers;
  }

  /**
   * Publish a generic event to the Event Bus
   */
  async publish(eventType: EventType, payload: any, publisherId: string) {
    console.log(`[EventBus] Received Event: ${eventType} from ${publisherId}`);

    // 1. Store the event immutably
    const event: EventLog = {
      id: `EVT-${Date.now()}`,
      eventType,
      payload,
      publisherId,
      timestamp: new Date()
    };
    this.eventLogs.push(event);

    // 2. Find matching subscribers
    const matchingSubs = this.subscribers.filter(sub => sub.isActive && sub.eventTypes.includes(eventType));

    if (matchingSubs.length === 0) {
      console.log(`[EventBus] No active subscribers for ${eventType}.`);
      return { success: true, eventId: event.id, dispatchedTo: 0 };
    }

    // 3. Queue the event for delivery to each subscriber
    for (const sub of matchingSubs) {
      await this.queueService.enqueue(event.id, sub);
    }

    // Trigger queue processing async (In reality, a background worker does this)
    this.queueService.processQueue();

    return { success: true, eventId: event.id, dispatchedTo: matchingSubs.length };
  }

  async getLogs() {
    return this.eventLogs;
  }

  /**
   * Replay an event for recovery or debugging
   */
  async replayEvent(eventId: string) {
    const event = this.eventLogs.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found.');

    console.log(`[EventBus] 🔁 REPLAYING Event: ${event.eventType} (ID: ${eventId})`);
    
    // Re-publish but mark as a replay
    return this.publish(event.eventType, { ...event.payload, isReplay: true }, 'SYS-REPLAY');
  }
}
