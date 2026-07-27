import { FileRecord, FileMetadata } from '../models/file.model';
import crypto from 'crypto';

export class FileService {
  private allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  private maxSize = 10 * 1024 * 1024; // 10MB

  async uploadFile(file: any, metadata: Omit<FileMetadata, 'fileId'>) {
    // 1. Validation
    if (file.size > this.maxSize) {
      throw new Error('File exceeds maximum size of 10MB');
    }
    if (!this.allowedMimeTypes.includes(file.mimeType)) {
      throw new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.');
    }

    // 2. Simulate Virus Scan
    console.log(`[FileService] Scanning file ${file.originalName} for malware...`);
    const isClean = true; // Simulated clean result
    if (!isClean) {
      throw new Error('Malware detected in uploaded file');
    }

    // 3. Generate ID and Secure URL
    const fileId = crypto.randomUUID();
    const secureUrl = `https://api.topclass.id/api/files/${fileId}`;
    const storagePath = `/secure-storage/tcu/${metadata.type.toLowerCase()}/${fileId}-${file.originalName}`;

    // 4. Save to Storage (S3 / Local simulation)
    console.log(`[FileService] Uploading file to ${storagePath}`);

    // 5. Save to DB (Simulated)
    const fileRecord: FileRecord = {
      id: fileId,
      filename: `${fileId}-${file.originalName}`,
      originalName: file.originalName,
      sizeBytes: file.size,
      mimeType: file.mimeType,
      storagePath,
      secureUrl,
      createdAt: new Date()
    };

    const fileMeta: FileMetadata = {
      fileId,
      ...metadata
    };

    return { record: fileRecord, meta: fileMeta };
  }

  async getFile(fileId: string) {
    console.log(`[FileService] Accessing secure file: ${fileId}`);
    // Simulate DB fetch
    return {
      id: fileId,
      secureUrl: `https://api.topclass.id/api/files/${fileId}`,
      storagePath: `/secure-storage/tcu/misc/${fileId}.jpg`
    };
  }

  async getFilesByCustomer(customerId: string) {
    // Simulate DB fetch
    return [
      { id: 'f-123', type: 'KTP', customerId },
      { id: 'f-124', type: 'KK', customerId }
    ];
  }

  async getFilesByTicket(ticketId: string) {
    // Simulate DB fetch
    return [
      { id: 'f-555', type: 'TICKET_ATTACHMENT', ticketId }
    ];
  }

  async deleteFile(fileId: string) {
    // 1. Remove from Storage
    console.log(`[FileService] Deleting file ${fileId} from storage`);
    // 2. Remove from DB
    return { success: true };
  }
}
