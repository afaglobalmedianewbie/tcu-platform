import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { NocDashboardData } from '../types/noc';
import { useNOCStore } from '../store/nocStore';

export function useNoc() {
  const { setDashboardData, setOlts, setSessions, setMapPoints } = useNOCStore();

  return useQuery<NocDashboardData>({
    queryKey: ['noc-dashboard'],
    queryFn: async () => {
      // Merged NOC dashboard reporting endpoint
      const data = await apiClient<NocDashboardData>('/api/noc/dashboard');
      if (data) {
        setDashboardData(data);
        if (data.olts) setOlts(data.olts);
        if (data.pppoeSessions) setSessions(data.pppoeSessions);
        if (data.mapPoints) setMapPoints(data.mapPoints);
      }
      return data;
    },
    refetchInterval: 15000, // Poll NOC stats every 15s
    placeholderData: {
      olts: [
        { id: 'olt-1', name: 'OLT-Jakarta-Pusat', ip: '10.10.2.1', uptime: '45d 12h', cpu: 12, temp: 48, status: 'ONLINE' },
        { id: 'olt-2', name: 'OLT-Banjar-Barat', ip: '10.10.4.1', uptime: '12d 6h', cpu: 28, temp: 58, status: 'ONLINE' },
        { id: 'olt-3', name: 'OLT-Ciamis-Timur', ip: '10.10.5.1', uptime: '125d 2h', cpu: 78, temp: 76, status: 'WARNING' },
        { id: 'olt-4', name: 'OLT-Pangandaran-Selatan', ip: '10.10.8.1', uptime: '0d 1h', cpu: 92, temp: 84, status: 'OFFLINE' }
      ],
      onuSignals: [
        { range: '-15 to -20 dBm', count: 1240 },
        { range: '-21 to -24 dBm', count: 850 },
        { range: '-25 to -27 dBm', count: 145 },
        { range: '> -28 dBm (Loss)', count: 12 }
      ],
      pppoeSessions: [
        { username: 'pppoe_cst001', ipAddress: '100.64.10.12', uptime: '4d 12h', macAddress: '00:1A:2B:3C:4D:5E', callerId: 'GPON-01/1/3:12', profile: '30Mbps_Home' },
        { username: 'pppoe_cst045', ipAddress: '100.64.10.142', uptime: '0d 6h', macAddress: '00:1A:2B:3C:99:AA', callerId: 'GPON-02/1/4:9', profile: '50Mbps_Business' },
        { username: 'pppoe_cst821', ipAddress: '100.64.11.23', uptime: '1d 2h', macAddress: '00:1A:2B:3C:BB:CC', callerId: 'GPON-03/1/1:2', profile: '100Mbps_Dedicated' }
      ],
      mapPoints: [
        { id: 'pt-1', type: 'OLT', name: 'OLT Ciamis', latitude: -7.3274, longitude: 108.3553, status: 'ONLINE' },
        { id: 'pt-2', type: 'TECHNICIAN', name: 'Andi Pratama', latitude: -7.3345, longitude: 108.3499, status: 'ACTIVE' },
        { id: 'pt-3', type: 'CUSTOMER', name: 'CST-001 (Budi)', latitude: -7.3299, longitude: 108.3610, status: 'ONLINE' }
      ]
    }
  });
}
