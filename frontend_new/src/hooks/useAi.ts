import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { PredictRisk, TrafficOverview } from '../types/ai';

export function useAiPredict(customerId: string) {
  return useQuery<PredictRisk>({
    queryKey: ['ai-predict', customerId],
    queryFn: () => apiClient<PredictRisk>(`/api/ai/predict/${customerId}`),
    enabled: !!customerId,
    placeholderData: {
      customerId: customerId || 'CST-001',
      customerName: 'Budi Santoso',
      riskScore: 84,
      riskLevel: 'HIGH',
      factors: [
        'Redaman ONU berfluktuasi antara -26 dBm s/d -28.5 dBm dalam 24 jam terakhir',
        'Uptime router PPPoE putus-nyambung 3 kali dalam semalam',
        'Suhu OLT modul GPON-01/1/3 terdeteksi panas 78°C'
      ],
      recommendation: 'Jadwalkan pembersihan konektor APC drop-core atau penggantian patchcord di sisi pelanggan.'
    }
  });
}

export function useAiTrafficOverview() {
  return useQuery<TrafficOverview>({
    queryKey: ['ai-traffic-overview'],
    queryFn: () => apiClient<TrafficOverview>('/api/ai-traffic/overview'),
    refetchInterval: 20000,
    placeholderData: {
      spikes: [
        { timestamp: '10:00', loadGbps: 1.2, isSpike: false },
        { timestamp: '11:00', loadGbps: 1.5, isSpike: false },
        { timestamp: '12:00', loadGbps: 2.8, isSpike: true },
        { timestamp: '13:00', loadGbps: 1.9, isSpike: false },
        { timestamp: '14:00', loadGbps: 3.4, isSpike: true },
        { timestamp: '15:00', loadGbps: 2.1, isSpike: false }
      ],
      anomalies: [
        { id: 'anm-1', timestamp: '2026-07-16 14:02:12', ipSource: '103.15.20.44', type: 'DDoS Amplification', severity: 'CRITICAL', description: 'Lonjakan paket UDP port 53 (DNS) melebihi threshold 500% rata-rata normal.' },
        { id: 'anm-2', timestamp: '2026-07-16 12:45:00', ipSource: '100.64.10.12', type: 'IP Scan Activity', severity: 'MEDIUM', description: 'Port scanning terdeteksi ke subnet 10.10.2.0/24.' },
        { id: 'anm-3', timestamp: '2026-07-16 11:15:30', ipSource: '10.10.4.1', type: 'BGP Route Flapping', severity: 'HIGH', description: 'Perubahan rute BGP berkali-kali dalam interval pendek.' }
      ]
    }
  });
}
