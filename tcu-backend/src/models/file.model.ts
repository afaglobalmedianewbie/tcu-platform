export interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  storagePath: string;
  secureUrl: string;
  createdAt: Date;
}

export interface FileMetadata {
  fileId: string;
  type: 'KTP' | 'KK' | 'INSTALLATION' | 'BILLING_PROOF' | 'TICKET_ATTACHMENT' | 'WORK_ORDER';
  customerId?: string;
  ticketId?: string;
  uploaderId: string;
  uploaderRole: string;
}
