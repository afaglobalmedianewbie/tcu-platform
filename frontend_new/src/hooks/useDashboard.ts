import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { DashboardData, TechnicianActivity } from '../types/dashboard';
import { useAdminStore } from '../store/adminStore';

export function useDashboard() {
  const { setDashboardData } = useAdminStore();

  return useQuery<DashboardData>({
    queryKey: ['dashboard-reporting'],
    queryFn: async () => {
      const data = await apiClient<DashboardData>('/api/reporting/dashboard');
      if (data) setDashboardData(data);
      return data;
    },
    refetchInterval: 30000, // Poll every 30s
    placeholderData: {
      kpis: {
        revenue: { value: 742500000, change: 12.4 },
        customers: { value: 14850, change: 8.2 },
        tickets: { value: 45, change: -15.4 },
        outages: { value: 2, change: -50.0 },
      },
      revenueHistory: [
        { month: 'Jan', amount: 620000000, growth: 5.4 },
        { month: 'Feb', amount: 645000000, growth: 4.0 },
        { month: 'Mar', amount: 680000000, growth: 5.4 },
        { month: 'Apr', amount: 710000000, growth: 4.4 },
        { month: 'May', amount: 730000000, growth: 2.8 },
        { month: 'Jun', amount: 742500000, growth: 1.7 },
      ],
      outageHistory: [
        { day: 'Sen', count: 0 },
        { day: 'Sel', count: 1 },
        { day: 'Rab', count: 0 },
        { day: 'Kam', count: 2 },
        { day: 'Jum', count: 0 },
        { day: 'Sab', count: 1 },
        { day: 'Min', count: 0 },
      ]
    }
  });
}

export function useTechnicianActivity() {
  const { setActivities } = useAdminStore();

  return useQuery<TechnicianActivity[]>({
    queryKey: ['technician-activity'],
    queryFn: async () => {
      const data = await apiClient<TechnicianActivity[]>('/api/technician/activity');
      if (data) setActivities(data);
      return data;
    },
    refetchInterval: 15000, // Poll every 15s
    placeholderData: [
      { id: 'tech-1', name: 'Andi Pratama', status: 'ACTIVE', lastTask: 'Instalasi Baru - Banjar Indah', completedTasks: 4 },
      { id: 'tech-2', name: 'Budi Santoso', status: 'ACTIVE', lastTask: 'Perbaikan Loss Sinyal - Lintas Barat', completedTasks: 2 },
      { id: 'tech-3', name: 'Citra Lestari', status: 'IDLE', lastTask: 'Patroli Jalur Fiber - Pangandaran', completedTasks: 3 },
      { id: 'tech-4', name: 'Dedi Kurniawan', status: 'OFFLINE', lastTask: 'Kembali ke Gudang Tasikmalaya', completedTasks: 5 },
    ]
  });
}
