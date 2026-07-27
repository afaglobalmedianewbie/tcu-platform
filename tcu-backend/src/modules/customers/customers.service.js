const customerRepo = require('./customers.repository');
const { HttpError } = require('../../core/http/http-error');

class CustomerService {
  async getAllCustomers(skip, take) {
    return await customerRepo.findAll(skip, take);
  }

  async getCustomerById(id) {
    const customer = await customerRepo.findById(id);
    if (!customer) throw new HttpError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return customer;
  }

  async createCustomer(data) {
    return await customerRepo.create(data);
  }

  async updateCustomer(id, data) {
    const exists = await customerRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return await customerRepo.update(id, data);
  }

  async deleteCustomer(id) {
    const exists = await customerRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return await customerRepo.softDelete(id);
  }

  async getCustomerServices(id) {
    const exists = await customerRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return await customerRepo.findServicesByCustomerId(id);
  }

  async getCustomerDocuments(id) {
    const exists = await customerRepo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return await customerRepo.findDocumentsByCustomerId(id);
  }
}

module.exports = new CustomerService();
