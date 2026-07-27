export interface Journal {
  id: string;
  date: Date;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference?: string; // e.g. invoice_id, ticket_id
  createdBy: string;
  createdAt: Date;
}
