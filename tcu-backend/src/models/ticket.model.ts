export interface Ticket {
  id: string;
  customerId: string;
  category: 'INTERNET_DOWN' | 'LOW_SIGNAL' | 'BILLING_ISSUE' | 'INSTALLATION' | 'OTHER';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTechnician?: string;
  status: 'OPEN' | 'PROGRESS' | 'CLOSED';
  slaTimerMinutes: number; // e.g. 120 = 2 hours SLA
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketLog {
  id: string;
  ticketId: string;
  userId: string;
  action: 'CREATED' | 'ASSIGNED' | 'STATUS_UPDATED' | 'COMMENTED' | 'ATTACHMENT_ADDED' | 'CLOSED';
  notes: string;
  timestamp: Date;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  uploaderId: string;
  fileUrl: string;
  fileType: string; // e.g. 'IMAGE_JPEG', 'PDF'
  uploadedAt: Date;
}
