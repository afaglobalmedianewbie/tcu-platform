import { OLTNode, ClusterBalanceReport } from '../models/cluster.model';
import { ClusterTopologyService } from './cluster_topology.service';
import { AiService } from './ai.service'; // For failure prediction

export class ClusterService {
  private topologyService = new ClusterTopologyService();
  private aiService = new AiService();

  async getOltList(): Promise<OLTNode[]> {
    return [
      { id: 'olt-zte-1', clusterId: 'CLUSTER-1', name: 'OLT_ZTE_01', ipAddress: '172.29.205.62', brand: 'ZTE', model: 'C320', uplinkPort: '10GE', totalPonPorts: 16, activeOnus: 250, cpuUsagePercent: 45, temperatureCelsius: 48, status: 'ONLINE' },
      { id: 'olt-huawei-1', clusterId: 'CLUSTER-1', name: 'OLT_HUAWEI_01', ipAddress: '172.29.205.63', brand: 'HUAWEI', model: 'MA5608T', uplinkPort: '10GE', totalPonPorts: 16, activeOnus: 890, cpuUsagePercent: 88, temperatureCelsius: 65, status: 'DEGRADED' },
      { id: 'olt-vsol-1', clusterId: 'CLUSTER-1', name: 'OLT_VSOL_01', ipAddress: '172.29.205.64', brand: 'VSOL', model: 'V1600D', uplinkPort: '1GE', totalPonPorts: 4, activeOnus: 90, cpuUsagePercent: 30, temperatureCelsius: 40, status: 'ONLINE' }
    ];
  }

  async getOltDetails(oltId: string) {
    const list = await this.getOltList();
    return list.find(o => o.id === oltId);
  }

  async addOlt(payload: Partial<OLTNode>) {
    console.log(`[Cluster] Adding new OLT ${payload.ipAddress}...`);
    // Simulated Auto-Detect Brand via SNMP sysDescr
    const detectedBrand = payload.brand || 'UNKNOWN';
    console.log(`[Cluster] Auto-detected brand: ${detectedBrand}. Loading unified profile...`);
    
    return { success: true, message: `OLT added successfully to cluster. Unified profile for ${detectedBrand} loaded.` };
  }

  async removeOlt(oltId: string) {
    console.log(`[Cluster] Removing OLT ${oltId} from cluster...`);
    return { success: true, message: 'OLT removed' };
  }

  async getTopology(clusterId: string) {
    return this.topologyService.getClusterTopology(clusterId);
  }

  async analyzeClusterBalance(clusterId: string): Promise<ClusterBalanceReport> {
    const list = await this.getOltList();
    
    const overloadedNodes = list.filter(o => o.cpuUsagePercent > 80 || o.activeOnus > 800).map(o => o.id);
    const underutilizedNodes = list.filter(o => o.cpuUsagePercent < 40 && o.activeOnus < 200).map(o => o.id);
    
    // Integrate AI to predict failure risk on overloaded nodes
    let aiRisk = 0;
    if (overloadedNodes.length > 0) {
      const prediction = await this.aiService.predictOlt(overloadedNodes[0]);
      aiRisk = prediction.score;
    }

    const recommendations = [];
    if (overloadedNodes.includes('olt-huawei-1') && underutilizedNodes.includes('olt-vsol-1')) {
      recommendations.push('Migrate 100 ONUs from OLT_HUAWEI_01 (PON 1/2) to OLT_VSOL_01 (PON 1/1) to relieve CPU stress.');
    }

    return {
      clusterId,
      isBalanced: overloadedNodes.length === 0,
      overloadedNodes,
      underutilizedNodes,
      recommendations,
      aiFailurePredictionRisk: aiRisk,
      generatedAt: new Date()
    };
  }

  async rebalanceCluster(clusterId: string) {
    console.log(`[Cluster] Executing auto-rebalance for ${clusterId}...`);
    // Logic to move logical profiles or warn NOC to move physical splitters
    return { success: true, message: 'Rebalance tasks queued. Awaiting physical NOC actions for Splitter Migration.' };
  }
}
