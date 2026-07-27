import { Request, Response } from 'express';
import { PackageService } from './package.service';
import { sendSuccess, sendPaginated } from '../../core/http/api-response';
import { getPaginationParams, getPaginatedMeta } from '../../core/pagination/pagination.helper';
import { PaginationQueryDto } from '../../core/pagination/pagination.dto';
import { logAudit } from '../../core/audit/audit.service';

const service = new PackageService();

export const getPackages = async (req: Request, res: Response) => {
  const { skip, take, page, limit } = getPaginationParams(req.query as unknown as PaginationQueryDto);
  const { data, total } = await service.getPackages(skip, take);
  const meta = getPaginatedMeta(total, page, limit);
  return sendPaginated(res, 200, 'Daftar paket berhasil ditarik', data, meta);
};

export const getPackageById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.getPackageById(id);
  return sendSuccess(res, 200, 'Detail paket layanan', data);
};

export const createPackage = async (req: Request, res: Response) => {
  const data = await service.createPackage(req.body);
  await logAudit(req, 'PACKAGE_CREATED', data.id);
  return sendSuccess(res, 201, 'Katalog paket baru diterbitkan', data);
};

export const updatePackage = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.updatePackage(id, req.body);
  await logAudit(req, 'PACKAGE_UPDATED', id);
  return sendSuccess(res, 200, 'Data paket telah disesuaikan', data);
};

export const activatePackage = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.activatePackage(id);
  await logAudit(req, 'PACKAGE_ACTIVATED', id);
  return sendSuccess(res, 200, 'Paket diaktifkan dan siap dijual', data);
};

export const deactivatePackage = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await service.deactivatePackage(id);
  await logAudit(req, 'PACKAGE_DEACTIVATED', id);
  return sendSuccess(res, 200, 'Paket dibekukan dari penjualan', data);
};
