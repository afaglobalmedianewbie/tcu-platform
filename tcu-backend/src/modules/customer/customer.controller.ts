import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { sendSuccess, sendPaginated } from '../../core/http/api-response';
import { getPaginationParams, getPaginatedMeta } from '../../core/pagination/pagination.helper';
import { PaginationQueryDto } from '../../core/pagination/pagination.dto';
import { logAudit } from '../../core/audit/audit.service';

const service = new CustomerService();

export const getCustomers = async (req: Request, res: Response) => {
  const { skip, take, page, limit } = getPaginationParams(req.query as unknown as PaginationQueryDto);
  const { data, total } = await service.getCustomers(skip, take);
  const meta = getPaginatedMeta(total, page, limit);
  return sendPaginated(res, 200, 'Operasi baca nasabah berhasil', data, meta);
};

export const getCustomerById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.getCustomerById(id);
  return sendSuccess(res, 200, 'Data detail nasabah', data);
};

export const createCustomer = async (req: Request, res: Response) => {
  const data = await service.createCustomer(req.body);
  await logAudit(req, 'CUSTOMER_CREATED', data.id);
  return sendSuccess(res, 201, 'Nasabah baru berhasil dicatat', data);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.updateCustomer(id, req.body);
  await logAudit(req, 'CUSTOMER_UPDATED', id);
  return sendSuccess(res, 200, 'Data nasabah dimutakhirkan', data);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await service.deleteCustomer(id);
  await logAudit(req, 'CUSTOMER_DELETED', id);
  return sendSuccess(res, 200, 'Akun nasabah berhasil dihapus');
};
