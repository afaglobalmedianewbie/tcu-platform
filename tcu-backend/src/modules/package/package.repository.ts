import { PrismaClient } from '@prisma/client';
import { CreatePackageDto, UpdatePackageDto } from './package.dto';

const prisma = new PrismaClient(); // Placeholder

export class PackageRepository {
  async findAll(skip: number, take: number) {
    return [];
  }
  async count() { return 0; }
  async findById(id: string) { return null; }
  
  async create(data: CreatePackageDto) {
    return { id: 'pkg-uuid-001', status: 'INACTIVE', ...data };
  }
  
  async update(id: string, data: UpdatePackageDto) {
    return { id, ...data };
  }
  
  async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    return { id, status };
  }
}
