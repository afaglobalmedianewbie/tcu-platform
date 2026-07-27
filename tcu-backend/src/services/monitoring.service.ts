import { SnmpService } from './snmp.service';
import { RadiusService } from './radius.service';
import { MonitoringLog, MonitoringAlert } from '../models/monitoring.model';

export class MonitoringService {
  private snmpService = new SnmpService();
  private radiusService = new RadiusService();

  async getOltOnu(oltId: string) {
    // Simulating mapping oltId to IP
    const ip = '172.29.205.62';
    const community = 'tcuro';
    return this.snmpService.getOnuList(ip, community);
  }

  async getOltStatus(oltId: string) {
    return this.snmpService.getOltStatus('172.29.205.62', 'tcuro');
  }

  async getPppoeSessions() {
    return this.radiusService.getActiveSessions();
  }

  async getLogs(limit: number = 100): Promise<MonitoringLog[]> {
    // Simulated aggregated logs from DB
    return [
      { id: '1', source: 'SNMP', level: 'INFO', message: 'OLT_PADAHERANG SNMP Connection Established', timestamp: new Date() },
      { id: '2', source: 'VPN', level: 'ERROR', message: 'Radius Connection Timeout for NAS 172.29.205.62', timestamp: new Date() },
      { id: '3', source: 'CLI', level: 'SUCCESS', message: 'Deployed NAT config to MikroTik', timestamp: new Date() },
      { id: '4', source: 'BILLING', level: 'WARNING', message: '5 Invoices expired today', timestamp: new Date() },
      { id: '5', source: 'TICKET', level: 'INFO', message: 'Ticket TKT-1234 assigned to tech1', timestamp: new Date() }
    ].slice(0, limit);
  }

  async getAlerts(): Promise<MonitoringAlert[]> {
    // Aggregates alerts (Offline ONU, Low Signal, PPPoE Drop, Unpaid, SLA Overdue)
    return [
      {
        id: 'A1',
        type: 'OFFLINE_ONU',
        severity: 'HIGH',
        description: 'ONU gpon-onu_0/1/15 is offline (Loss of Signal)',
        targetId: 'gpon-onu_0/1/15',
        resolved: false,
        createdAt: new Date()
      },
      {
        id: 'A2',
        type: 'LOW_SIGNAL',
        severity: 'MEDIUM',
        description: 'ONU gpon-onu_0/1/16 has low signal (-26.5 dBm)',
        targetId: 'gpon-onu_0/1/16',
        resolved: false,
        createdAt: new Date()
      },
      {
        id: 'A3',
        type: 'TICKET_SLA_OVERDUE',
        severity: 'CRITICAL',
        description: 'Ticket TKT-123 SLA has expired (Over 2 hours)',
        targetId: 'TKT-123',
        resolved: false,
        createdAt: new Date()
      }
    ];
  }
}
