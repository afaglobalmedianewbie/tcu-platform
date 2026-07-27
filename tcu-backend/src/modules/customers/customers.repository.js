const { PrismaClient } = require('@prisma/client');

// Prisma placeholder (to be replaced by singleton later)
const prisma = new PrismaClient();

class CustomerRepository {
  async findAll(skip, take) {
    // return prisma.customer.findMany({ skip, take, where: { deletedAt: null } });
    return [];
  }

  async findById(id) {
    // return prisma.customer.findFirst({ where: { id, deletedAt: null } });
    return null;
  }

  async create(data) {
    // return prisma.customer.create({ data });
    return { id: 'uuid-placeholder', ...data };
  }

  async update(id, data) {
    // return prisma.customer.update({ where: { id }, data });
    return { id, ...data };
  }

  async softDelete(id) {
    // 3. Gunakan konsep 'soft delete', BUKAN hard delete.
    // return prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
    return { id, deletedAt: new Date() };
  }

  async findServicesByCustomerId(id) {
    // return prisma.service.findMany({ where: { customerId: id } });
    return [];
  }

  async findDocumentsByCustomerId(id) {
    // return prisma.document.findMany({ where: { customerId: id } });
    return [];
  }
}

module.exports = new CustomerRepository();
