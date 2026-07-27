import { NodeRegistry } from '../models/autoscale.model';

export class LoadBalancerService {
  private activeNodes: NodeRegistry[] = [];
  private roundRobinIndex = 0;

  constructor() {
    // Initialize with a mock node
    this.activeNodes.push({
      id: 'NODE-1',
      ipAddress: '10.0.0.11',
      port: 3000,
      weight: 1,
      status: 'ACTIVE',
      createdAt: new Date()
    });
  }

  getActiveNodes(): NodeRegistry[] {
    return this.activeNodes.filter(n => n.status === 'ACTIVE');
  }

  addNode(node: NodeRegistry) {
    this.activeNodes.push(node);
  }

  removeNode(nodeId: string) {
    const node = this.activeNodes.find(n => n.id === nodeId);
    if (node) {
      node.status = 'OFFLINE';
    }
  }

  /**
   * Next node via Round-Robin
   */
  getNextNodeRoundRobin(): NodeRegistry | null {
    const active = this.getActiveNodes();
    if (active.length === 0) return null;

    const node = active[this.roundRobinIndex % active.length];
    this.roundRobinIndex++;
    return node;
  }

  /**
   * Next node via Least Connections (simulated)
   */
  getNextNodeLeastConnections(nodeHealthData: Map<string, number>): NodeRegistry | null {
    const active = this.getActiveNodes();
    if (active.length === 0) return null;

    let selectedNode = active[0];
    let minConn = nodeHealthData.get(selectedNode.id) || 0;

    for (let i = 1; i < active.length; i++) {
      const conn = nodeHealthData.get(active[i].id) || 0;
      if (conn < minConn) {
        selectedNode = active[i];
        minConn = conn;
      }
    }
    return selectedNode;
  }

  /**
   * Rebalance traffic manually
   */
  async rebalance() {
    console.log(`[LoadBalancer] Rebalancing traffic across ${this.getActiveNodes().length} active nodes...`);
    this.roundRobinIndex = 0;
    return { success: true, message: 'Traffic rebalanced' };
  }
}
