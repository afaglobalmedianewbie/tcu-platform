import { PrismaClient } from '@prisma/client';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

// Placeholder DB Instance (Akan dihubungkan sungguhan ke instance tunggal/Singleton kelak)
const prisma = new PrismaClient();

export class CustomerRepository {
  async findAll(skip: number, take: number) {
    // Placeholder - menghindari Prisma melempar error saat belum dimigrasi
    // return prisma.customer.findMany({ skip, take });
    return [];
  }

  async count() {
    // return prisma.customer.count();
    return 0;
  }

  async findById(id: string) {
    // return prisma.customer.findUnique({ where: { id } });
    return null;
  }

  async create(data: CreateCustomerDto) {
    // return prisma.customer.create({ data });
    return { id: 'uuid-placeholder-001', ...data };
  }

  async update(id: string, data: UpdateCustomerDto) {
    // return prisma.customer.update({ where: { id }, data });
    return { id, ...data };
  }

  async remove(id: string) {
    // return prisma.customer.delete({ where: { id } });
    return { id };
  }
}
