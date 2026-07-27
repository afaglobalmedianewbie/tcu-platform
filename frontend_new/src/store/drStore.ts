import { create } from 'zustand';
import { DRNode, DRStatus } from '../types/dr';

interface DRState {
  replicationStatus: DRStatus['replicationStatus'];
  nodes: DRNode[];
  failoverModalOpen: boolean;
  isTriggeringFailover: boolean;
  setReplicationStatus: (status: DRStatus['replicationStatus']) => void;
  setNodes: (nodes: DRNode[]) => void;
  setFailoverModalOpen: (open: boolean) => void;
  setIsTriggeringFailover: (triggering: boolean) => void;
  triggerEmergencyFailover: () => void;
}

export const useDRStore = create<DRState>((set) => ({
  replicationStatus: 'SYNCED',
  nodes: [
    { id: 'JKT-01', region: 'Jakarta (Primary)', status: 'ACTIVE', traffic: '45.2 Gbps', ping: '12ms', dbLag: '0s' },
    { id: 'SGP-02', region: 'Singapore (Standby)', status: 'STANDBY', traffic: '0 Gbps', ping: '38ms', dbLag: '1.2s' }
  ],
  failoverModalOpen: false,
  isTriggeringFailover: false,
  setReplicationStatus: (replicationStatus) => set({ replicationStatus }),
  setNodes: (nodes) => set({ nodes }),
  setFailoverModalOpen: (failoverModalOpen) => set({ failoverModalOpen }),
  setIsTriggeringFailover: (isTriggeringFailover) => set({ isTriggeringFailover }),
  triggerEmergencyFailover: () => set((state) => {
    // Local state override for failover swap
    const updatedNodes: DRNode[] = state.nodes.map((node) => {
      if (node.id === 'JKT-01') {
        return { ...node, status: 'OFFLINE', region: 'Jakarta (Offline)', traffic: '0 Gbps', ping: 'TIMEOUT', dbLag: 'UNKNOWN' };
      }
      if (node.id === 'SGP-02') {
        return { ...node, status: 'ACTIVE', region: 'Singapore (Primary)', traffic: '45.2 Gbps', ping: '10ms', dbLag: '0s' };
      }
      return node;
    });
    return {
      nodes: updatedNodes,
      replicationStatus: 'BROKEN',
      failoverModalOpen: false,
      isTriggeringFailover: false
    };
  }),
}));
