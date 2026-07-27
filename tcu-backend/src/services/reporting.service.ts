import { RevenueReport, CustomerGrowth, ChurnReport, NetworkUptime, SignalQuality, TechnicianPerformance } from '../models/reporting.model';
import { FinanceService } from './finance.service';
// Can also import other services (TicketService, SnmpService) for aggregate DB queries in a real implementation

export class ReportingService {
  private financeService = new FinanceService();

  async getRevenueDaily(): Promise<RevenueReport> {
    const rev = await this.financeService.getDailyRevenue();
    return {
      period: rev.date,
      totalRevenue: rev.totalRevenue,
      arpu: 150000,
      mrr: 45000000,
      bepStatus: true
    };
  }

  async getRevenueMonthly(): Promise<RevenueReport> {
    const rev = await this.financeService.getMonthlyRevenue();
    const bepInfo = await this.financeService.calculateBep();
    return {
      period: rev.month,
      totalRevenue: rev.totalRevenue,
      arpu: bepInfo.arpu,
      mrr: rev.totalRevenue,
      bepStatus: bepInfo.bep.isProfitable
    };
  }

  async getRevenueYearly() {
    return { period: '2026', totalRevenue: 540000000, arpu: 150000, mrr: 45000000, bepStatus: true };
  }

  async getCustomerGrowth(): Promise<CustomerGrowth> {
    return {
      periodMonth: '2026-07',
      newCustomers: 25,
      activeCount: 300,
      suspendedCount: 15,
      coverageDistribution: {
        'PANGANDARAN': 150,
        'PADAHERANG': 150
      }
    };
  }

  async getCustomerChurn(): Promise<ChurnReport> {
    return {
      periodMonth: '2026-07',
      churnRatePercent: 1.5,
      lostCustomers: 5
    };
  }

  async getNetworkUptime(): Promise<NetworkUptime[]> {
    return [
      { oltId: 'OLT_PADAHERANG', uptimePercentage: 99.9, outageMinutes: 43 }
    ];
  }

  async getNetworkSignal(): Promise<SignalQuality[]> {
    return [
      { oltId: 'OLT_PADAHERANG', greenCount: 250, yellowCount: 30, redCount: 10, offlineCount: 10 }
    ];
  }

  async getPppoeSessionsAnalytics() {
    return {
      totalActiveSessions: 290,
      peakConcurrentUsers: 305,
      avgSessionUptimeHours: 72
    };
  }

  async getTechnicianPerformance(): Promise<TechnicianPerformance[]> {
    return [
      { technicianId: 'tech1', totalWorkOrders: 45, avgCompletionTimeHours: 1.5, slaCompliancePercent: 95.5, ticketResolutionRatePercent: 98.0 }
    ];
  }

  async getDashboardSummary() {
    return {
      revenue: await this.getRevenueMonthly(),
      growth: await this.getCustomerGrowth(),
      churn: await this.getCustomerChurn(),
      network: (await this.getNetworkSignal())[0],
      technician: (await this.getTechnicianPerformance())[0]
    };
  }
}
