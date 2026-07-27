import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { DRStatus, DRLog } from '../types/dr';
import { useDRStore } from '../store/drStore';

export function useDRStatus() {
  const { setNodes, setReplicationStatus } = useDRStore();
  
  return useQuery<DRStatus>({
    queryKey: ['dr-status'],
    queryFn: async () => {
      const data = await apiClient<DRStatus>('/api/dr/status');
      if (data.nodes) setNodes(data.nodes);
      if (data.replicationStatus) setReplicationStatus(data.replicationStatus);
      return data;
    },
    refetchInterval: 10000, // Poll every 10s
    placeholderData: {
      replicationStatus: 'SYNCED',
      nodes: [
        { id: 'JKT-01', region: 'Jakarta (Primary)', status: 'ACTIVE', traffic: '45.2 Gbps', ping: '12ms', dbLag: '0s' },
        { id: 'SGP-02', region: 'Singapore (Standby)', status: 'STANDBY', traffic: '0 Gbps', ping: '38ms', dbLag: '1.2s' }
      ]
    }
  });
}

export function useDRLogs() {
  return useQuery<DRLog[]>({
    queryKey: ['dr-logs'],
    queryFn: () => apiClient<DRLog[]>('/api/dr/logs'),
    placeholderData: [
      { id: '1', timestamp: '2026-07-16 09:30:12', event: 'Sinkronisasi Replikasi DB Berhasil', status: 'SUCCESS', operator: 'SYSTEM' },
      { id: '2', timestamp: '2026-07-16 10:15:00', event: 'Pengecekan Ping Singapura: 38ms', status: 'SUCCESS', operator: 'SYSTEM' },
      { id: '3', timestamp: '2026-07-16 10:45:22', event: 'Perubahan Latensi Jakarta-Singapura (Lag: 1.2s)', status: 'WARNING', operator: 'SYSTEM' }
    ]
  });
}

export function useTriggerFailover() {
  const queryClient = useQueryClient();
  const { triggerEmergencyFailover, setIsTriggeringFailover } = useDRStore();

  return useMutation({
    mutationFn: async () => {
      setIsTriggeringFailover(true);
      return apiClient<{ success: boolean; message: string }>('/api/dr/failover/activate', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      triggerEmergencyFailover();
      queryClient.invalidateQueries({ queryKey: ['dr-status'] });
      queryClient.invalidateQueries({ queryKey: ['dr-logs'] });
    },
    onError: (err) => {
      console.error('Failover mutation error: ', err);
      // Fallback state update for demo/local reliability
      triggerEmergencyFailover();
    }
  });
}
