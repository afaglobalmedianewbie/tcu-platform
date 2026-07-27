import { ClusterTopology } from '../models/cluster.model';

export class ClusterTopologyService {
  
  async getClusterTopology(clusterId: string): Promise<ClusterTopology> {
    console.log(`[ClusterTopology] Generating cluster map for ${clusterId}`);
    
    // Cloud -> MikroTik -> OLT Cluster -> ONU -> Customer
    const nodes = [
      { id: 'cloud', type: 'CLOUD', name: 'Internet Upstream' },
      { id: 'mk-core', type: 'MIKROTIK', name: 'MikroTik Core' },
      { id: 'olt-zte-1', type: 'OLT_NODE', brand: 'ZTE', name: 'OLT_ZTE_01', activeOnus: 250 },
      { id: 'olt-huawei-1', type: 'OLT_NODE', brand: 'HUAWEI', name: 'OLT_HUAWEI_01', activeOnus: 180 },
      { id: 'olt-vsol-1', type: 'OLT_NODE', brand: 'VSOL', name: 'OLT_VSOL_01', activeOnus: 90 }
    ];

    const links = [
      { source: 'cloud', target: 'mk-core', type: 'ETHERNET' },
      { source: 'mk-core', target: 'olt-zte-1', type: 'FIBER_UPLINK' },
      { source: 'mk-core', target: 'olt-huawei-1', type: 'FIBER_UPLINK' },
      { source: 'mk-core', target: 'olt-vsol-1', type: 'FIBER_UPLINK' }
    ];

    return {
      clusterId,
      nodes,
      links,
      lastUpdated: new Date()
    };
  }
}
