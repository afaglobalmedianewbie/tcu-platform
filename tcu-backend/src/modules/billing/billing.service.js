const billingRepo = require('./billing.repository');
const { HttpError } = require('../../core/http/http-error');

class BillingService {
  async getInvoices(skip, take) {
    return await billingRepo.findInvoices(skip, take);
  }

  async getInvoiceById(id) {
    const invoice = await billingRepo.findInvoiceById(id);
    if (!invoice) throw new HttpError(404, 'Invoice not found', 'INVOICE_NOT_FOUND');
    return invoice;
  }

  async createInvoice(data) {
    return await billingRepo.createInvoice(data);
  }

  async getPayments(skip, take) {
    return await billingRepo.findPayments(skip, take);
  }

  async createPayment(data) {
    // RULE 1: Do not implement real payment gateway calls yet.
    // RULE 2: Use placeholders for Xendit integration.
    if (data.method === 'XENDIT_VA') {
      // TODO: Panggil modul eksternal Xendit di masa mendatang untuk membentuk rekening Virtual.
      console.log(`[XENDIT PLACEHOLDER] Generating VA for Invoice ${data.invoiceId}`);
    }
    return await billingRepo.createPayment(data);
  }

  async reconcilePayment(paymentId) {
    const payment = await billingRepo.findPaymentById(paymentId);
    if (!payment) throw new HttpError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    
    // RULE 3 & 4: Do not trigger Radius suspend yet. Do not mutate customer network status yet.
    // Transisi penagihan hanya mengubah status pelunasan finansial semata.
    return await billingRepo.updatePaymentStatus(paymentId, 'VERIFIED');
  }

  async refundPayment(paymentId, reason) {
    const payment = await billingRepo.findPaymentById(paymentId);
    if (!payment) throw new HttpError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    return await billingRepo.recordRefund(paymentId, reason);
  }

  async adjustInvoice(invoiceId, amount, reason) {
    const invoice = await billingRepo.findInvoiceById(invoiceId);
    if (!invoice) throw new HttpError(404, 'Invoice not found', 'INVOICE_NOT_FOUND');
    return await billingRepo.adjustInvoice(invoiceId, amount, reason);
  }
}

module.exports = new BillingService();
