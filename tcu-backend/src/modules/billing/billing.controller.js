const billingService = require('./billing.service');
const { sendSuccess } = require('../../core/http/api-response');
const { logAudit } = require('../../core/audit/audit-logger');

const getInvoices = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const data = await billingService.getInvoices(skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

const getInvoiceById = async (req, res) => {
  const data = await billingService.getInvoiceById(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

const createInvoice = async (req, res) => {
  const data = await billingService.createInvoice(req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: data.id,
    targetType: 'Invoice',
    action: 'INVOICE_CREATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 201, 'Invoice created', data);
};

const getPayments = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const data = await billingService.getPayments(skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

const createPayment = async (req, res) => {
  const data = await billingService.createPayment(req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: data.id,
    targetType: 'Payment',
    action: 'PAYMENT_RECEIVED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 201, 'Payment received', data);
};

const reconcilePayment = async (req, res) => {
  const data = await billingService.reconcilePayment(req.body.paymentId);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.body.paymentId,
    targetType: 'Payment',
    action: 'PAYMENT_VERIFIED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Payment reconciled', data);
};

const refundPayment = async (req, res) => {
  const data = await billingService.refundPayment(req.body.paymentId, req.body.reason);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.body.paymentId,
    targetType: 'Payment',
    action: 'PAYMENT_REFUND',
    metadata: { reason: req.body.reason },
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Payment refunded', data);
};

const adjustInvoice = async (req, res) => {
  const data = await billingService.adjustInvoice(req.body.invoiceId, req.body.adjustmentAmount, req.body.reason);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.body.invoiceId,
    targetType: 'Invoice',
    action: 'INVOICE_ADJUSTED',
    metadata: { adjustmentAmount: req.body.adjustmentAmount, reason: req.body.reason },
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Invoice adjusted', data);
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  getPayments,
  createPayment,
  reconcilePayment,
  refundPayment,
  adjustInvoice
};
