import { TopologyNode, TopologyLink, TopologyAlert } from '../models/topology.model';
import { SnmpService } from './snmp.service';
import { RadiusService } from './radius.service';

export class TopologyService {
  private snmpService = new SnmpService();
  private radiusService = new RadiusService();

  async getOltTopology(oltId: string) {
    // Return a structured tree or node-link graph: Cloud -> MikroTik -> OLT -> ONUs
    const nodes: TopologyNode[] = [
      { id: 'cloud', type: 'CLOUD', name: 'Internet / Upstream', status: 'ONLINE' },
      { id: 'mikrotik', type: 'MIKROTIK', name: 'Core Router', ipAddress: '103.X.X.X', status: 'ONLINE' },
      { id: oltId, type: 'OLT', name: 'OLT_PADAHERANG', ipAddress: '172.29.205.62', status: 'ONLINE', metadata: { uplink: 'mgt1' } }
    ];

    const links: TopologyLink[] = [
      { id: 'link_c_m', sourceId: 'cloud', targetId: 'mikrotik', type: 'ETHERNET', status: 'ACTIVE' },
      { id: 'link_m_o', sourceId: 'mikrotik', targetId: oltId, type: 'VPN', status: 'ACTIVE' }
    ];

    // Fetch ONUs from SNMP
    const onus = await this.snmpService.getOnuList('172.29.205.62', 'tcuro');
    onus.forEach(onu => {
      nodes.push({
        id: onu.id,
        type: 'ONU',
        name: onu.name,
        status: onu.status === 'Online' ? 'ONLINE' : 'OFFLINE',
        metadata: { power: onu.power }
      });
      links.push({
        id: `link_${oltId}_${onu.id}`,
        sourceId: oltId,
        targetId: onu.id,
        type: 'FIBER',
        status: onu.status === 'Online' ? 'ACTIVE' : 'DOWN'
      });
    });

    return { nodes, links };
  }

  async getOnuTopology(onuId: string) {
    // Traces OLT -> ONU -> Customer (PPPoE session)
    return {
      nodes: [
        { id: onuId, type: 'ONU', name: 'CUSTOMER_ONU', status: 'ONLINE' },
        { id: 'cust1', type: 'CUSTOMER', name: 'John Doe', status: 'ONLINE', metadata: { pppoeUptime: '5h' } }
      ],
      links: [
        { id: `link_${onuId}_cust1`, sourceId: onuId, targetId: 'cust1', type: 'PPPOE', status: 'ACTIVE' }
      ]
    };
  }

  async getCustomerTopology(customerId: string) {
    // Specific slice for a customer
    return this.getOnuTopology('gpon-onu_0/1/18'); // Simulated mapping
  }

  async getMapData() {
    // Returns nodes that have geolocations (Customers and Active Technicians)
    const nodes: TopologyNode[] = [
      { id: 'olt_1', type: 'OLT', name: 'OLT_PADAHERANG', geolocation: { lat: -7.6321, lng: 108.7612 }, status: 'ONLINE' },
      { id: 'cust1', type: 'CUSTOMER', name: 'John Doe', geolocation: { lat: -7.6350, lng: 108.7640 }, status: 'ONLINE' },
      { id: 'tech1', type: 'TECHNICIAN', name: 'Tech Jono', geolocation: { lat: -7.6345, lng: 108.7622 }, status: 'ONLINE' }
    ];
    return { nodes };
  }

  async getAlerts(): Promise<TopologyAlert[]> {
    return [
      { id: 'ta_1', nodeId: 'gpon-onu_0/1/15', type: 'ONU_OFFLINE', message: 'Loss of Signal on PON 1', severity: 'CRITICAL', timestamp: new Date() },
      { id: 'ta_2', nodeId: 'cust1', type: 'PPPOE_DROP', message: 'PPPoE Session dropped unexpectedly', severity: 'HIGH', timestamp: new Date() }
    ];
  }
}
