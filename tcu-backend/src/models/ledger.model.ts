export interface Ledger {
  accountId: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
  lastUpdated: Date;
}
