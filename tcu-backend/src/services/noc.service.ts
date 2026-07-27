import { NOCAlert, NOCMapNode, NOCSession } from '../models/noc.model';
import { NocRealtimeService } from './noc_realtime.service';

export class NocService {
  private realtimeService = new NocRealtimeService();

  async getDashboardSummary() {
    return {
      oltOnline: 4,
      oltOffline: 0,
      onuGreen: 1200,
      onuYellow: 45,
      onuRed: 12,
      pppoeActive: 1180,
      vpnOnline: 2,
      technicianActive: 5,
      ticketOpen: 8,
      slaViolations: 0
    };
  }

  async getOltStatus() {
    return [
      { name: 'OLT-ZTE-01', status: 'ONLINE', cpu: '45%' }
    ];
  }

  async getOnuStatus() {
    return { total: 1257, online: 1245, offline: 12 };
  }

  async getPppoeSessions(): Promise<NOCSession[]> {
    return [
      { id: 'sess-1', sessionId: '817293', type: 'PPPOE', username: 'user_101', ipAddress: '10.10.10.2', uptimeHours: 24, status: 'ACTIVE' }
    ];
  }

  async getVpnStatus() {
    return [
      { name: 'MikroTik-Core-VPN', status: 'ONLINE', uptime: '15d' }
    ];
  }

  async getTechnicianStatus() {
    return [
      { name: 'Teknisi Budi', status: 'MOVING', currentTask: 'Repair PON 1' }
    ];
  }

  async getCustomerStatus() {
    return { totalActive: 1200, totalSuspended: 40 };
  }

  async getAlerts(): Promise<NOCAlert[]> {
    const alerts: NOCAlert[] = [
      { id: 'ALR-1', source: 'ONU', message: 'Loss of Signal on PON 1/2', severity: 'CRITICAL', timestamp: new Date(), isAcknowledged: false }
    ];
    return alerts;
  }

  async getMapData(): Promise<NOCMapNode[]> {
    return [
      { id: 'olt1', type: 'OLT', name: 'OLT Padaherang', lat: -7.6321, lng: 108.7612, status: 'ONLINE' },
      { id: 'tech1', type: 'TECHNICIAN', name: 'Budi (Mobil 1)', lat: -7.6350, lng: 108.7640, status: 'MOVING' }
    ];
  }
}
