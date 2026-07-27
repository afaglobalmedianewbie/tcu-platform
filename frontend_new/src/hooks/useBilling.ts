import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { Invoice, SettlementReport } from '../types/billing';

export function useInvoices(customerId?: string) {
  return useQuery<Invoice[]>({
    queryKey: ['invoices', customerId],
    queryFn: async () => {
      const endpoint = customerId 
        ? `/api/payment/history/${customerId}`
        : '/api/payment/history/all'; // fallback mock endpoint
      return apiClient<Invoice[]>(endpoint);
    },
    refetchInterval: 30000,
    placeholderData: [
      { id: 'INV-2026-0001', customerId: 'CST-001', customerName: 'Budi Santoso', amount: 150000, status: 'PAID', dueDate: '2026-07-05', paidAt: '2026-07-04 10:20', paymentMethod: 'Xendit Virtual Account', planName: 'Home Lite 30 Mbps', billingPeriod: 'Juli 2026' },
      { id: 'INV-2026-0002', customerId: 'CST-002', customerName: 'Siti Rahma', amount: 350000, status: 'UNPAID', dueDate: '2026-07-25', planName: 'Business Pro 100 Mbps', billingPeriod: 'Juli 2026' },
      { id: 'INV-2026-0003', customerId: 'CST-003', customerName: 'Ahmad Faisal', amount: 150000, status: 'EXPIRED', dueDate: '2026-06-05', planName: 'Home Lite 30 Mbps', billingPeriod: 'Juni 2026' }
    ]
  });
}

export function useInvoiceDetail(invoiceId: string) {
  return useQuery<Invoice>({
    queryKey: ['invoice-detail', invoiceId],
    queryFn: () => apiClient<Invoice>(`/api/payment/invoice/${invoiceId}`),
    enabled: !!invoiceId,
  });
}

export function useSettlementReport() {
  return useQuery<SettlementReport>({
    queryKey: ['billing-settlement-report'],
    queryFn: () => apiClient<SettlementReport>('/api/payment/settlement/report'),
    placeholderData: {
      totalRevenue: 650000000,
      paidCount: 4120,
      unpaidCount: 380,
      settlementRate: 91.5
    }
  });
}

export function useConfirmManualPayment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; paymentMethod: string }>({
    mutationFn: async ({ id, paymentMethod }) => {
      await apiClient('/api/payment/manual/confirm', {
        method: 'POST',
        body: JSON.stringify({ id, paymentMethod })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-settlement-report'] });
    }
  });
}
