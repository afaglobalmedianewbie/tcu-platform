import { Journal } from '../models/journal.model';
import { Ledger } from '../models/ledger.model';
import { Capex } from '../models/capex.model';
import { Opex } from '../models/opex.model';

export class FinanceService {

  async createJournalEntry(payload: Partial<Journal>, userId: string) {
    const journal: Journal = {
      id: `JRN-${Date.now()}`,
      date: payload.date || new Date(),
      description: payload.description!,
      debitAccount: payload.debitAccount!,
      creditAccount: payload.creditAccount!,
      amount: payload.amount!,
      reference: payload.reference,
      createdBy: userId,
      createdAt: new Date()
    };
    console.log(`[Finance] Journal Entry Created: ${journal.id}`);
    
    // In real app, we also update the Ledger balances here within a DB Transaction
    // await this.updateLedger(journal);
    
    return journal;
  }

  async getJournal(journalId: string) {
    // Simulated DB fetch
    return { id: journalId, amount: 150000, description: 'Simulated Entry' };
  }

  async getLedger() {
    // Simulated DB aggregate
    const mockLedger: Ledger[] = [
      { accountId: '101', accountName: 'Cash', totalDebit: 50000000, totalCredit: 20000000, balance: 30000000, lastUpdated: new Date() },
      { accountId: '401', accountName: 'Internet Revenue', totalDebit: 0, totalCredit: 45000000, balance: -45000000, lastUpdated: new Date() }
    ];
    return mockLedger;
  }

  async getDailyRevenue() {
    // Simulated DB Query: sum(amount) from Journal where account = Revenue and date = today
    return { date: new Date().toISOString().split('T')[0], totalRevenue: 1550000 };
  }

  async getMonthlyRevenue() {
    return { month: '2026-07', totalRevenue: 45000000 };
  }

  async addCapex(payload: Partial<Capex>, userId: string) {
    console.log(`[Finance] CAPEX Added: ${payload.category} - Rp${payload.amount}`);
    // Simulate DB insert
    return { success: true, message: 'CAPEX recorded' };
  }

  async addOpex(payload: Partial<Opex>, userId: string) {
    console.log(`[Finance] OPEX Added: ${payload.category} - Rp${payload.amount}`);
    // Simulate DB insert
    return { success: true, message: 'OPEX recorded' };
  }

  /**
   * Calculate Break-Even Point (BEP)
   */
  async calculateBep() {
    // 1. Fetch total monthly OPEX
    const monthlyOpex = 12000000;
    
    // 2. Fetch total CAPEX amortized for this month
    // E.g. OLT costs 15,000,000 amortized over 36 months = 416,666 / month
    const monthlyCapexAmortization = 3500000;

    // 3. Customer ARPU (Average Revenue Per User)
    const activeCustomers = 300;
    const monthlyRevenue = 45000000;
    const arpu = monthlyRevenue / activeCustomers; // 150,000

    // 4. Fixed Costs = OPEX + CAPEX Amortization
    const fixedCosts = monthlyOpex + monthlyCapexAmortization;
    
    // 5. BEP (in Users) = Fixed Costs / ARPU (assuming negligible Variable Cost per extra user for simplicity)
    const bepUsers = Math.ceil(fixedCosts / arpu);
    const bepRevenue = bepUsers * arpu;

    return {
      monthlyRevenue,
      monthlyOpex,
      monthlyCapexAmortization,
      arpu,
      activeCustomers,
      bep: {
        usersRequired: bepUsers,
        revenueRequired: bepRevenue,
        isProfitable: activeCustomers > bepUsers
      }
    };
  }
}
