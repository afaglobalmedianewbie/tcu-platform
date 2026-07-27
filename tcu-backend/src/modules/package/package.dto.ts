export interface CreatePackageDto {
  name: string;
  description?: string;
  price: number;
  bandwidthMbps: number;
}
export interface UpdatePackageDto {
  name?: string;
  description?: string;
  price?: number;
  bandwidthMbps?: number;
}
