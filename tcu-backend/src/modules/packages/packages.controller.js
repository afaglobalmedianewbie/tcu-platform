const packageService = require('./packages.service');
const { sendSuccess } = require('../../core/http/api-response');
const { logAudit } = require('../../core/audit/audit-logger');

const getPackages = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const data = await packageService.getAllPackages(skip, take);
  return sendSuccess(res, 200, 'Success', data);
};

const getPackageById = async (req, res) => {
  const data = await packageService.getPackageById(req.params.id);
  return sendSuccess(res, 200, 'Success', data);
};

const createPackage = async (req, res) => {
  const data = await packageService.createPackage(req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: data.id,
    targetType: 'Package',
    action: 'PACKAGE_CREATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 201, 'Package created', data);
};

const updatePackage = async (req, res) => {
  const data = await packageService.updatePackage(req.params.id, req.body);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Package',
    action: 'PACKAGE_UPDATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Package updated', data);
};

const activatePackage = async (req, res) => {
  const data = await packageService.activatePackage(req.params.id);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Package',
    action: 'PACKAGE_ACTIVATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Package activated', data);
};

const deactivatePackage = async (req, res) => {
  const data = await packageService.deactivatePackage(req.params.id);
  await logAudit({
    actorId: req.user?.id,
    targetId: req.params.id,
    targetType: 'Package',
    action: 'PACKAGE_DEACTIVATED',
    ipAddress: req.ip
  });
  return sendSuccess(res, 200, 'Package deactivated', data);
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  activatePackage,
  deactivatePackage
};
