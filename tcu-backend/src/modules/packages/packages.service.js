const packageRepo = require('./packages.repository');
const { HttpError } = require('../../core/http/http-error');

class PackageService {
  async getAllPackages(skip, take) {
    return await packageRepo.findAll(skip, take);
  }

  async getPackageById(id) {
    const pkg = await packageRepo.findById(id);
    if (!pkg) throw new HttpError(404, 'Package not found', 'PACKAGE_NOT_FOUND');
    return pkg;
  }

  async createPackage(data) {
    return await packageRepo.create(data);
  }

  async updatePackage(id, data) {
    const exists = await packageRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Package not found', 'PACKAGE_NOT_FOUND');
    return await packageRepo.update(id, data);
  }

  async activatePackage(id) {
    const exists = await packageRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Package not found', 'PACKAGE_NOT_FOUND');
    return await packageRepo.updateStatus(id, true);
  }

  async deactivatePackage(id) {
    const exists = await packageRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Package not found', 'PACKAGE_NOT_FOUND');
    return await packageRepo.updateStatus(id, false);
  }
}

module.exports = new PackageService();
