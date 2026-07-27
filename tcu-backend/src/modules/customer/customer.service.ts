import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { HttpError } from '../../core/http/http-error';

export class CustomerService {
  private repo = new CustomerRepository();

  async getCustomers(skip: number, take: number) {
    const data = await this.repo.findAll(skip, take);
    const total = await this.repo.count();
    return { data, total };
  }

  async getCustomerById(id: string) {
    const customer = await this.repo.findById(id);
    if (!customer) throw new HttpError(404, 'Customer tidak ditemukan', 'CUSTOMER_NOT_FOUND');
    return customer;
  }

  async createCustomer(dto: CreateCustomerDto) {
    return this.repo.create(dto);
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto) {
    // Pengecekan eksistensi sebelum update agar tidak tabrakan (Crash)
    const exists = await this.repo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer tidak ditemukan', 'CUSTOMER_NOT_FOUND');
    return this.repo.update(id, dto);
  }

  async deleteCustomer(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new HttpError(404, 'Customer tidak ditemukan', 'CUSTOMER_NOT_FOUND');
    return this.repo.remove(id);
  }
}
