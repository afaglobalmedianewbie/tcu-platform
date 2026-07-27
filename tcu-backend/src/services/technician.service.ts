import { WorkOrder, WorkOrderLog, WorkOrderAttachment } from '../models/workorder.model';
import { TechnicianLocation } from '../models/technician_location.model';

export class TechnicianService {
  
  async getWorkOrders(technicianId: string) {
    // Simulated DB fetch
    return [
      {
        id: `WO-123`,
        ticketId: 'TKT-123',
        status: 'ASSIGNED',
        priority: 'HIGH',
        address: 'Jl. Merdeka No 1',
        slaTimerMinutes: 60
      }
    ];
  }

  async getWorkOrder(workOrderId: string) {
    // Simulated DB fetch
    return {
      id: workOrderId,
      status: 'ASSIGNED',
      attachments: [],
      logs: []
    };
  }

  async acceptWorkOrder(workOrderId: string, technicianId: string) {
    console.log(`[Technician] ${technicianId} accepted work order ${workOrderId}`);
    // Update DB status to ASSIGNED -> Log ACCEPTED
    return { success: true, message: 'Work order accepted' };
  }

  async updateWorkStatus(workOrderId: string, technicianId: string, status: string, notes: string) {
    console.log(`[Technician] ${technicianId} updated work order ${workOrderId} status to ${status}. Notes: ${notes}`);
    // Update DB status (ON_THE_WAY, WORKING) -> Log STATUS_UPDATED
    return { success: true, status, notes };
  }

  async completeWorkOrder(workOrderId: string, technicianId: string, notes: string) {
    console.log(`[Technician] ${technicianId} completed work order ${workOrderId}. Notes: ${notes}`);
    // Update DB status to COMPLETED -> Log COMPLETED
    // In real app, this also updates the parent Ticket status to CLOSED/RESOLVED
    return { success: true, message: 'Work order completed' };
  }

  async uploadPhoto(workOrderId: string, technicianId: string, fileUrl: string) {
    console.log(`[Technician] ${technicianId} uploaded photo for WO ${workOrderId}`);
    // Insert into WorkOrderAttachment DB
    return { success: true, fileUrl };
  }

  async updateGpsLocation(technicianId: string, latitude: number, longitude: number, accuracy: number, speed?: number, heading?: number) {
    // Insert into TechnicianLocation DB
    // Useful for tracking in map and showing "Technician is on the way" to customer
    console.log(`[Technician] GPS Updated for ${technicianId}: [${latitude}, ${longitude}] (Acc: ${accuracy}m)`);
    return { success: true };
  }
}
