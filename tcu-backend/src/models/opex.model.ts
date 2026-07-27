export interface Opex {
  id: string;
  category: 'SALARY' | 'ELECTRICITY' | 'INTERNET_UPSTREAM' | 'MAINTENANCE' | 'OFFICE_COST';
  description: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
  recordedBy: string;
}
