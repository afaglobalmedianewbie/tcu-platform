import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { CustomerDashboardData, SpeedtestResult } from '../types/customer';
import { useCustomerStore } from '../store/customerStore';

export function useCustomerDashboard() {
  const { setDashboardData } = useCustomerStore();

  return useQuery<CustomerDashboardData>({
    queryKey: ['customer-dashboard'],
    queryFn: async () => {
      // Aggregate data from endpoint
      const data = await apiClient<CustomerDashboardData>('/api/mobile/dashboard');
      if (data) setDashboardData(data);
      return data;
    },
    refetchInterval: 60000, // Poll every 1m
    placeholderData: {
      customerName: 'John Doe',
      pppoeUsername: 'pppoe_johndoe',
      internetStatus: 'ONLINE',
      onuSignal: {
        rxPower: -19.4,
        status: 'EXCELLENT'
      },
      activeInvoice: {
        invoiceId: 'INV-2026-0811',
        amount: 150000,
        dueDate: '2026-08-05',
        status: 'UNPAID'
      },
      subscription: {
        planName: 'TopClass Home 30 Mbps',
        speedLimit: '30',
        price: 150000,
        renewalDate: '2026-08-05'
      },
      tickets: [
        { id: 'TKT-1002', category: 'Teknis', subject: 'Kabel Drop-Core Putus Terlindas Truk', status: 'PROCESSING', createdAt: '2026-07-15 14:20' },
        { id: 'TKT-0982', category: 'Administrasi', subject: 'Permintaan Downgrade Paket', status: 'RESOLVED', createdAt: '2026-07-02 09:00' }
      ]
    }
  });
}

export function useSpeedtest() {
  const { setSpeedtestResult, setIsTestingSpeed } = useCustomerStore();

  return useMutation<SpeedtestResult, Error, void>({
    mutationFn: async () => {
      setIsTestingSpeed(true);
      setSpeedtestResult(null);

      // Simulate a real speedtest delay (3.5s)
      await new Promise((resolve) => setTimeout(resolve, 3500));

      const result: SpeedtestResult = {
        ping: Math.floor(Math.random() * 15) + 3, // 3ms - 17ms
        download: parseFloat((Math.random() * 5 + 28.5).toFixed(2)), // 28.5Mbps - 33.5Mbps
        upload: parseFloat((Math.random() * 3 + 14.2).toFixed(2)), // 14.2Mbps - 17.2Mbps
      };

      return result;
    },
    onSuccess: (result) => {
      setSpeedtestResult(result);
      setIsTestingSpeed(false);
    },
    onError: () => {
      setIsTestingSpeed(false);
    }
  });
}
