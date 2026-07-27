const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Placeholder for singleton

class PackageRepository {
  async findAll(skip, take) {
    // return prisma.package.findMany({ skip, take });
    return [];
  }

  async findById(id) {
    // return prisma.package.findUnique({ where: { id } });
    return null;
  }

  async create(data) {
    // return prisma.package.create({ data });
    return { id: 'pkg-uuid-placeholder', ...data, isActive: true };
  }

  async update(id, data) {
    // 2. Business safety: Price update must not overwrite existing customer billing price.
    //    Konsep dipastikan via skema (Subscription mengunci harga paket di masa itu, bukan merelasikan harganya terus-menerus).
    // return prisma.package.update({ where: { id }, data });
    return { id, ...data };
  }

  async updateStatus(id, isActive) {
    // 1. Business safety: Deactivation must not disconnect existing customers.
    //    Hanya bendera aktivasi `isActive` yang diubah menjadi false, mencegah pelanggan baru mendaftar paket ini.
    // return prisma.package.update({ where: { id }, data: { isActive } });
    return { id, isActive };
  }
}

module.exports = new PackageRepository();
