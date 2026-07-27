import { SnmpService } from './snmp.service';
import { VpnService } from './vpn.service';
import { CliService } from './cli.service';

export class OltService {
  private snmpService = new SnmpService();
  private vpnService = new VpnService();
  private cliService = new CliService();

  async addOlt(data: any) {
    // Save OLT to DB
    // e.g. await prisma.olt.create({ data })
    return { id: 1, ...data };
  }

  async getOnuList(oltId: string) {
    // Retrieve OLT IP & Community from DB
    // using mock data for now
    const ip = '172.29.205.62';
    const community = 'tcuro';
    return this.snmpService.getOnuList(ip, community);
  }

  async getOnuDetail(oltId: string, onuId: string) {
    return this.snmpService.getOnuDetail('172.29.205.62', 'tcuro', onuId);
  }

  async createVpn(username: string, remoteIp: string) {
    return this.vpnService.createVpnClient(username, 'defaultPass123', remoteIp);
  }

  async applyProfile(onuId: string, profile: any) {
    // Generate CLI and simulate applying
    const config = this.cliService.generateOnuProfileConfig(profile.name || 'default', profile.vlan || 100);
    // Real app would push this via telnet/ssh/snmp depending on setup
    return { success: true, commandsRun: config };
  }

  generateCliScripts(oltIp: string, vpnIp: string) {
    return {
      snmp: this.cliService.generateSnmpSetup('tcuro', 'tcurw'),
      mikrotik: this.cliService.generateMikrotikNatScript(oltIp, vpnIp)
    };
  }
}
