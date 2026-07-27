export class ManualPaymentService {
  
  /**
   * Process manual payment confirmation
   */
  async confirmPayment(invoiceId: string, proofImageUrl: string, recordedBy: string) {
    console.log(`[ManualPayment] Received proof ${proofImageUrl} for invoice ${invoiceId}`);
    // Simulate Finance Approval queue
    return {
      invoiceId,
      status: 'PENDING_VERIFICATION',
      message: 'Bukti transfer sedang diverifikasi oleh tim Finance.'
    };
  }
}
