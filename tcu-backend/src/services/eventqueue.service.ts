import { EventQueue, EventLog, EventSubscriber } from '../models/event.model';

export class EventQueueService {
  private queue: EventQueue[] = [];

  /**
   * Enqueue an event for a specific subscriber
   */
  async enqueue(eventId: string, subscriber: EventSubscriber) {
    const queueItem: EventQueue = {
      id: `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId,
      subscriberId: subscriber.id,
      status: 'PENDING',
      retryCount: 0
    };
    
    this.queue.push(queueItem);
    console.log(`[MessageQueue] Event ${eventId} queued for subscriber: ${subscriber.name}`);
    return queueItem;
  }

  /**
   * Process pending items in the queue (Worker loop simulation)
   */
  async processQueue() {
    const pendingItems = this.queue.filter(q => q.status === 'PENDING' || (q.status === 'FAILED' && q.retryCount < 3));

    for (const item of pendingItems) {
      item.status = 'PROCESSING';
      item.lastAttemptAt = new Date();
      
      try {
        console.log(`[MessageQueue] Dispatching event payload for ${item.subscriberId}...`);
        // Simulated HTTP Webhook / Function Call to Subscriber
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        
        item.status = 'COMPLETED';
        console.log(`[MessageQueue] Delivery SUCCESS to ${item.subscriberId}`);
      } catch (error: any) {
        item.retryCount += 1;
        item.errorMessage = error.message;
        
        if (item.retryCount >= 3) {
          item.status = 'DEAD_LETTER';
          console.log(`[MessageQueue] Delivery DEAD_LETTER for ${item.subscriberId}. Retries exhausted.`);
        } else {
          item.status = 'FAILED';
          console.log(`[MessageQueue] Delivery FAILED for ${item.subscriberId}. Will retry.`);
        }
      }
    }
  }

  async getDeadLetters() {
    return this.queue.filter(q => q.status === 'DEAD_LETTER');
  }
}
