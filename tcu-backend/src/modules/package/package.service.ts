import { PackageRepository } from './package.repository';
import { CreatePackageDto, UpdatePackageDto } from './package.dto';
import { HttpError } from '../../core/http/http-error';

export class PackageService {
  private repo = new PackageRepository();

  async getPackages(skip: number, take: number) {
    const data = await this.repo.findAll(skip, take);
    const total = await this.repo.count();
    return { data, total };
  }
  
  async getPackageById(id: string) {
    const pkg = await this.repo.findById(id);
    if (!pkg) throw new HttpError(404, 'Paket layanan tidak ditemukan', 'PACKAGE_NOT_FOUND');
    return pkg;
  }
  
  async createPackage(dto: CreatePackageDto) {
    return this.repo.create(dto);
  }
  
  async updatePackage(id: string, dto: UpdatePackageDto) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new HttpError(404, 'Paket layanan tidak ditemukan', 'PACKAGE_NOT_FOUND');
    return this.repo.update(id, dto);
  }
  
  async activatePackage(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new HttpError(404, 'Paket layanan tidak ditemukan', 'PACKAGE_NOT_FOUND');
    return this.repo.setStatus(id, 'ACTIVE');
  }
  
  async deactivatePackage(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new HttpError(404, 'Paket layanan tidak ditemukan', 'PACKAGE_NOT_FOUND');
    return this.repo.setStatus(id, 'INACTIVE');
  }
}
