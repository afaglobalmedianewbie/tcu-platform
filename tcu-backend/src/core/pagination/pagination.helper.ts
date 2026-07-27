import { PaginationQueryDto, PaginatedMeta } from './pagination.dto';

export const getPaginationParams = (query: PaginationQueryDto) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take, page, limit };
};

export const getPaginatedMeta = (total: number, page: number, limit: number): PaginatedMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};
