export class SnmpService {
  /**
   * Fetch ONU List from OLT via SNMP
   */
  async getOnuList(ip: string, community: string) {
    // Simulating the mapped status for Next.js UI
    const mockOnus = [
      { id: 'gpon-onu_0/1/15', name: 'BENDINELADI_ZIZI-BRZ', status: 'Offline', power: '-29.2' },
      { id: 'gpon-onu_0/1/16', name: 'CUSTOMER_A', status: 'Online', power: '-26.5' },
      { id: 'gpon-onu_0/1/18', name: 'CUSTOMER_B', status: 'Online', power: '-20.00' },
      { id: 'gpon-onu_0/2/10', name: 'CUSTOMER_C', status: 'Online', power: '-8.6' },
    ];

    return mockOnus.map(onu => {
      const powerLevel = parseFloat(onu.power);
      let signalColor = 'green';

      // Map signal levels as per requirements
      if (powerLevel <= -15 && powerLevel >= -25) {
        signalColor = 'green';
      } else if (powerLevel < -25 && powerLevel >= -28) {
        signalColor = 'yellow';
      } else if (powerLevel < -28) {
        signalColor = 'red';
      } else {
        // Technically > -15 is too hot, but fallback
        signalColor = 'green'; 
      }

      let mappedStatus = onu.status;
      if (mappedStatus === 'Online' && signalColor !== 'green') {
        mappedStatus = 'low_signals';
      }

      return {
        ...onu,
        mappedStatus,
        signalColor
      };
    });
  }

  /**
   * Fetch detailed metrics for a specific ONU
   */
  async getOnuDetail(ip: string, community: string, onuId: string) {
    // Implement SNMP GET for specific OID based on ONU ID
    return {
      id: onuId,
      serial: 'ALL-ONT-9382',
      type: 'ZTE GPON',
      powerRxOlt: '-20.1 dBm',
      powerRxOnu: '-19.5 dBm',
      distance: '1205 m',
      uptime: '15d 3h 2m'
    };
  }

  /**
   * Fetch OLT Hardware Status
   */
  async getOltStatus(ip: string, community: string) {
    return {
      ip,
      cpuUsage: '12%',
      memoryUsage: '45%',
      temperature: '42C',
      uptime: '120d 5h',
      status: 'ONLINE'
    };
  }
}
