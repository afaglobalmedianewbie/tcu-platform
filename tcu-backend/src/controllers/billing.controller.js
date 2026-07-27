/**
 * @file billing.controller.js
 * @description Controller untuk mengelola rute domain Billing (Consolidated)
 */
const billingService = require('../services/billing.service');
const auditService = require('../core/audit/audit.service');

class BillingController {
  // GET /api/admin/invoices
  async getInvoices(req, res, next) {
    try {
      const invoices = await billingService.getInvoices();
      await auditService.auditBillingAction(req, 'BILLING_INVOICES_VIEWED', 'SUCCESS');
      res.json({ success: true, invoices });
    } catch (err) {
      await auditService.auditBillingAction(req, 'BILLING_INVOICES_VIEWED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/admin/invoices/generate
  async generateInvoice(req, res, next) {
    try {
      const result = await billingService.generateMassInvoices();
      await auditService.auditBillingAction(req, 'INVOICE_GENERATED', 'SUCCESS', { period: result.period, count: result.count });
      res.status(201).json({
        success: true,
        message: `${result.count} tagihan berhasil digenerate untuk periode ${result.period}.`,
        count: result.count
      });
    } catch (err) {
      await auditService.auditBillingAction(req, 'INVOICE_GENERATED', 'FAIL', { error: err.message });
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new BillingController();
