import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { NocAlert } from '../types/dashboard';
import { useAdminStore } from '../store/adminStore';

export function useAlerts() {
  const { setAlerts, addAlert } = useAdminStore();

  const query = useQuery<NocAlert[]>({
    queryKey: ['noc-alerts'],
    queryFn: async () => {
      const data = await apiClient<NocAlert[]>('/api/noc/alerts');
      if (data) setAlerts(data);
      return data;
    },
    placeholderData: [
      { id: 'alt-1', timestamp: '10:32:15', severity: 'CRITICAL', message: 'OLT-3 Ciamis Kehilangan Daya AC', source: 'OLT-3' },
      { id: 'alt-2', timestamp: '10:28:40', severity: 'WARNING', message: 'Kepadatan Trafik GPON Port 1/2 Tasikmalaya', source: 'OLT-1' },
      { id: 'alt-3', timestamp: '10:15:10', severity: 'INFO', message: 'Sesi PPPoE Baru CST-921 Terhubung', source: 'RADIUS' },
    ]
  });

  // Simulated WebSocket/Live Alert Logic
  useEffect(() => {
    const alertsList = [
      { severity: 'CRITICAL' as const, message: 'ONT Offline Massal - Jalur Banjar-1 (5 Perangkat)', source: 'ACS' },
      { severity: 'WARNING' as const, message: 'Rx Power Sinyal Rendah CST-102: -28.5 dBm', source: 'OLT-2' },
      { severity: 'INFO' as const, message: 'Teknisi Andi Memulai Work Order WO-009', source: 'WO-ENGINE' },
    ];

    const interval = setInterval(() => {
      const randomAlert = alertsList[Math.floor(Math.random() * alertsList.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      addAlert({
        id: `alt-live-${now.getTime()}`,
        timestamp: timeStr,
        ...randomAlert
      });
    }, 45000); // Trigger a mock live alert every 45s

    return () => clearInterval(interval);
  }, [addAlert]);

  return query;
}
