export interface Capex {
  id: string;
  category: 'OLT' | 'ONU' | 'ROUTER' | 'FIBER' | 'TOOLS' | 'INSTALLATION_COST';
  description: string;
  amount: number;
  purchaseDate: Date;
  amortizationMonths: number;
  recordedBy: string;
}
