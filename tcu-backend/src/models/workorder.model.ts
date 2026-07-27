export interface WorkOrder {
  id: string;
  ticketId: string;
  customerId: string;
  address: string;
  geolocation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTechnician: string;
  status: 'ASSIGNED' | 'ON_THE_WAY' | 'WORKING' | 'COMPLETED';
  slaTimerMinutes: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderLog {
  id: string;
  workOrderId: string;
  technicianId: string;
  action: 'ACCEPTED' | 'STATUS_UPDATED' | 'COMMENTED' | 'COMPLETED';
  notes: string;
  timestamp: Date;
}

export interface WorkOrderAttachment {
  id: string;
  workOrderId: string;
  technicianId: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
}
