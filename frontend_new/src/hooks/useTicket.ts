import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { Ticket } from '../types/ticket';

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ['tickets-list'],
    queryFn: () => apiClient<Ticket[]>('/api/ticket'),
    refetchInterval: 30000,
    placeholderData: [
      { id: 'TKT-1021', title: 'ONT Loss Redaman Tinggi Ciamis', description: 'Redaman terbaca -28.5 dBm di GPON Port 1/2 OLT-3.', category: 'TEKNIS', priority: 'CRITICAL', status: 'PROCESSING', assignedTo: 'Andi Pratama', slaLimit: new Date(Date.now() + 45 * 60 * 1000).toISOString(), createdAt: '2026-07-16 09:30' },
      { id: 'TKT-1022', title: 'Permintaan Downgrade Pembayaran', description: 'Pelanggan meminta turun paket ke 30 Mbps.', category: 'BILLING', priority: 'MEDIUM', status: 'OPEN', slaLimit: new Date(Date.now() + 180 * 60 * 1000).toISOString(), createdAt: '2026-07-16 10:15' },
      { id: 'TKT-1023', title: 'Kabel Drop-Core Putus Terlindas Truk', description: 'Kabel fiber putus di tiang nomor 15 dekat jembatan.', category: 'TEKNIS', priority: 'HIGH', status: 'OPEN', slaLimit: new Date(Date.now() + 90 * 60 * 1000).toISOString(), createdAt: '2026-07-16 10:45' }
    ]
  });
}

export function useTicketDetail(ticketId: string) {
  return useQuery<Ticket>({
    queryKey: ['ticket-detail', ticketId],
    queryFn: () => apiClient<Ticket>(`/api/ticket/${ticketId}`),
    enabled: !!ticketId,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; status: Ticket['status']; assignedTo?: string }>({
    mutationFn: async ({ id, status, assignedTo }) => {
      await apiClient('/api/ticket/update', {
        method: 'POST',
        body: JSON.stringify({ id, status, assignedTo })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets-list'] });
    }
  });
}
