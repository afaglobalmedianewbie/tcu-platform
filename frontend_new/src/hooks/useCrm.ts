import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { Lead, CustomerDetailData } from '../types/crm';

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ['crm-leads'],
    queryFn: () => apiClient<Lead[]>('/api/crm/leads'),
    placeholderData: [
      { id: 'LD-001', name: 'Rian Hidayat', email: 'rian@gmail.com', phone: '08123456789', address: 'Perum Gading Indah, Ciamis', status: 'NEW', createdAt: '2026-07-15 08:30' },
      { id: 'LD-002', name: 'Santi Wijaya', email: 'santi@yahoo.com', phone: '08234567890', address: 'Jl. Pemuda No. 45, Banjar', status: 'CONTACTED', createdAt: '2026-07-14 11:20' },
      { id: 'LD-003', name: 'Joko Susilo', email: 'joko@outlook.com', phone: '08345678901', address: 'Kampung Lio RT 02/01, Tasikmalaya', status: 'QUALIFIED', createdAt: '2026-07-12 15:45' }
    ]
  });
}

export function useCustomerDetail(customerId: string) {
  return useQuery<CustomerDetailData>({
    queryKey: ['crm-customer-detail', customerId],
    queryFn: () => apiClient<CustomerDetailData>(`/api/crm/customer/${customerId}`),
    enabled: !!customerId,
    placeholderData: {
      id: 'CST-001',
      name: 'Budi Santoso',
      email: 'budi@topclass.id',
      phone: '08122334455',
      address: 'Jl. Lintas Barat No. 100, Ciamis',
      pppoeUsername: 'pppoe_budi',
      bandwidthProfile: '30Mbps_Home_FTTH',
      connectionStatus: 'ONLINE',
      onuRxPower: -19.5
    }
  });
}
