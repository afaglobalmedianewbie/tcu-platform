const customerService = require('./customers.service');
const { sendSuccess } = require('../../core/http/api-response');
const { logAudit, AUDIT_ACTIONS } = require('../../core/audit/audit-logger');

const getCustomers = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100); // 7. Paginasi aman
  const data = await customerService.getAllCustomers(skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

const getCustomerById = async (req, res) => {
  const data = await customerService.getCustomerById(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

const createCustomer = async (req, res) => {
  const data = await customerService.createCustomer(req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: data.id,
    targetType: 'Customer',
    action: AUDIT_ACTIONS.CREATE, // Placeholder: CUSTOMER_CREATED dirujuk dari actions
    ipAddress: req.ip
  });
  return sendSuccess(res, 201, 'Customer created', data);
};

const updateCustomer = async (req, res) => {
  const data = await customerService.updateCustomer(req.params.id, req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Customer',
    action: AUDIT_ACTIONS.UPDATE, // Placeholder: CUSTOMER_UPDATED
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Customer updated', data);
};

const deleteCustomer = async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Customer',
    action: AUDIT_ACTIONS.DELETE, // Placeholder: CUSTOMER_DELETED
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Customer deleted successfully');
};

const getCustomerServices = async (req, res) => {
  const data = await customerService.getCustomerServices(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

const getCustomerDocuments = async (req, res) => {
  const data = await customerService.getCustomerDocuments(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerServices,
  getCustomerDocuments
};
