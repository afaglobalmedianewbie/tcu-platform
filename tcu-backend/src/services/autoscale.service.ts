import { NodeRegistry, NodeHealth, LoadBalanceMetrics } from '../models/autoscale.model';
import { LoadBalancerService } from './loadbalancer.service';

export class AutoscaleService {
  private lbService = new LoadBalancerService();

  // Thresholds
  private MAX_CPU = 80;
  private MAX_LATENCY = 500; // ms

  async getNodes() {
    return this.lbService.getActiveNodes();
  }

  async addNode(ipAddress: string, port: number) {
    console.log(`[Autoscale] Provisioning new API node: ${ipAddress}:${port}`);
    const newNode: NodeRegistry = {
      id: `NODE-${Date.now()}`,
      ipAddress,
      port,
      weight: 1,
      status: 'ACTIVE',
      createdAt: new Date()
    };
    this.lbService.addNode(newNode);
    return newNode;
  }

  async removeNode(nodeId: string) {
    console.log(`[Autoscale] Removing API node: ${nodeId}`);
    this.lbService.removeNode(nodeId);
    return { success: true, message: 'Node removed gracefully' };
  }

  async getNodeHealth(nodeId: string): Promise<NodeHealth> {
    // Simulate fetching health
    return {
      nodeId,
      cpuUsagePercent: 45,
      memoryUsagePercent: 60,
      activeConnections: 1200,
      latencyMs: 120,
      errorRatePercent: 0.1,
      lastHeartbeat: new Date()
    };
  }

  async getMetrics(): Promise<LoadBalanceMetrics> {
    return {
      id: `METRICS-${Date.now()}`,
      timestamp: new Date(),
      requestsPerSecond: 2500,
      averageLatencyMs: 150,
      totalErrors: 5,
      nodesDistribution: {
        'NODE-1': 1300,
        'NODE-2': 1200
      }
    };
  }

  async rebalance() {
    return this.lbService.rebalance();
  }

  /**
   * Evaluator for Autoscale (Intended to be run on a Cron Job)
   */
  async evaluateScaling() {
    console.log(`[Autoscale] Evaluating cluster scale...`);
    const nodes = this.lbService.getActiveNodes();
    let totalCpu = 0;

    for (const node of nodes) {
      const health = await this.getNodeHealth(node.id);
      totalCpu += health.cpuUsagePercent;
    }

    const avgCpu = totalCpu / (nodes.length || 1);
    console.log(`[Autoscale] Average Cluster CPU: ${avgCpu}%`);

    if (avgCpu > this.MAX_CPU) {
      console.log(`[Autoscale] CRITICAL: CPU Threshold exceeded. Auto-spawning new node...`);
      await this.addNode(`10.0.0.${Math.floor(Math.random() * 100) + 20}`, 3000);
      await this.rebalance();
    }
  }
}
