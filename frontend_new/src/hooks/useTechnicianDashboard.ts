import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { TechnicianDashboardData, WorkOrder, PendingTask } from '../types/technician';
import { useTechnicianStore } from '../store/technicianStore';

export function useTechnicianDashboard() {
  const { setDashboardData, setLocation } = useTechnicianStore();

  return useQuery<TechnicianDashboardData>({
    queryKey: ['technician-dashboard'],
    queryFn: async () => {
      const data = await apiClient<TechnicianDashboardData>('/api/technician/tasks');
      if (data) {
        setDashboardData(data);
        if (data.location) setLocation(data.location);
      }
      return data;
    },
    refetchInterval: 20000, // Poll every 20s
    placeholderData: {
      workOrders: [
        { id: 'WO-001', customerName: 'Budi Santoso', address: 'Jl. Raya Barat No. 12, Banjar', type: 'INSTALLATION', priority: 'HIGH', status: 'PENDING', scheduledTime: '09:00 - 11:00' },
        { id: 'WO-002', customerName: 'Siti Rahma', address: 'Perum Gading Blok C-4, Ciamis', type: 'MAINTENANCE', priority: 'CRITICAL', status: 'IN_PROGRESS', scheduledTime: '13:00 - 14:30' },
        { id: 'WO-003', customerName: 'Ahmad Faisal', address: 'Kampung Lio RT 03/05, Pangandaran', type: 'DISCONNECT', priority: 'LOW', status: 'PENDING', scheduledTime: '15:30 - 16:30' }
      ],
      location: {
        latitude: -7.3686,
        longitude: 108.3551,
        accuracy: 15,
        lastUpdated: '10:45:00'
      },
      tasks: [
        { id: 'task-1', taskName: 'Ambil ONT ZTE F609 di Gudang Ciamis', dueDate: 'Hari Ini', status: 'TODO' },
        { id: 'task-2', taskName: 'Restock Drop Wire 1 Roll', dueDate: 'Hari Ini', status: 'IN_PROGRESS' },
        { id: 'task-3', taskName: 'Kembalikan OLT SFP module rusak', dueDate: 'Besok', status: 'TODO' }
      ],
      schedule: [
        { id: 'ev-1', time: '08:00', title: 'Daily Briefing & Standup', description: 'Briefing WO hari ini bersama Supervisor NOC', type: 'MEETING' },
        { id: 'ev-2', time: '09:00', title: 'WO-001: Budi Santoso', description: 'Instalasi Baru paket FTTH 30 Mbps', type: 'WO' },
        { id: 'ev-3', time: '12:00', title: 'Makan Siang & Break', description: 'Waktu istirahat dan ibadah sholat', type: 'BREAK' },
        { id: 'ev-4', time: '13:00', title: 'WO-002: Siti Rahma', description: 'Penanganan Loss Redaman Tinggi (FOC Bend)', type: 'WO' }
      ]
    }
  });
}

export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();
  const { updateWorkOrderStatus } = useTechnicianStore();

  return useMutation<void, Error, { id: string; status: WorkOrder['status'] }>({
    mutationFn: async ({ id, status }) => {
      await apiClient(`/api/technician/workorders/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status })
      });
    },
    onSuccess: (_, variables) => {
      updateWorkOrderStatus(variables.id, variables.status);
      queryClient.invalidateQueries({ queryKey: ['technician-dashboard'] });
    },
    onError: (err, variables) => {
      console.warn('Backend update simulation fallback: ', err);
      // Fallback state update for offline/demo resilience
      updateWorkOrderStatus(variables.id, variables.status);
    }
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { updateTaskStatus } = useTechnicianStore();

  return useMutation<void, Error, { id: string; status: PendingTask['status'] }>({
    mutationFn: async ({ id, status }) => {
      await apiClient(`/api/technician/tasks/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status })
      });
    },
    onSuccess: (_, variables) => {
      updateTaskStatus(variables.id, variables.status);
      queryClient.invalidateQueries({ queryKey: ['technician-dashboard'] });
    },
    onError: (err, variables) => {
      console.warn('Backend update simulation fallback: ', err);
      // Fallback state update for offline/demo resilience
      updateTaskStatus(variables.id, variables.status);
    }
  });
}
