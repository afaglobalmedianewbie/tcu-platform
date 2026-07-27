export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  identityNumber: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  status?: string;
}
