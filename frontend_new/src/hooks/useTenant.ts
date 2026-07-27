import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';
import { Tenant } from '../types/tenant';

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['saas-tenants'],
    queryFn: () => apiClient<Tenant[]>('/api/tenant/list'),
    placeholderData: [
      {
        id: 'tnt-001',
        companyName: 'PT Top Class Banjar',
        domain: 'banjar.topclass.id',
        adminEmail: 'admin.banjar@topclass.id',
        status: 'ACTIVE',
        createdAt: '2026-01-10 08:00',
        resources: {
          activePppoeCount: 1240,
          maxPppoeCount: 2000,
          activeOnuCount: 1100,
          maxOnuCount: 1500,
          bandwidthUsageGbps: 1.8,
          bandwidthCapGbps: 3.0
        },
        billing: {
          planName: 'Enterprise SaaS Lite',
          nextRenewalDate: '2026-08-10',
          monthlyCost: 2500000,
          paymentStatus: 'PAID'
        }
      },
      {
        id: 'tnt-002',
        companyName: 'PT Top Class Tasikmalaya',
        domain: 'tasik.topclass.id',
        adminEmail: 'admin.tasik@topclass.id',
        status: 'ACTIVE',
        createdAt: '2026-02-15 09:30',
        resources: {
          activePppoeCount: 2450,
          maxPppoeCount: 5000,
          activeOnuCount: 2100,
          maxOnuCount: 4000,
          bandwidthUsageGbps: 4.2,
          bandwidthCapGbps: 5.0
        },
        billing: {
          planName: 'Enterprise SaaS Pro',
          nextRenewalDate: '2026-08-15',
          monthlyCost: 5000000,
          paymentStatus: 'PAID'
        }
      },
      {
        id: 'tnt-003',
        companyName: 'Mitra ISP Ciamis Mandiri',
        domain: 'ciamis.topclass.id',
        adminEmail: 'admin.ciamis@topclass.id',
        status: 'SUSPENDED',
        createdAt: '2026-03-01 11:00',
        resources: {
          activePppoeCount: 450,
          maxPppoeCount: 1000,
          activeOnuCount: 400,
          maxOnuCount: 800,
          bandwidthUsageGbps: 0.9,
          bandwidthCapGbps: 2.0
        },
        billing: {
          planName: 'Enterprise SaaS Lite',
          nextRenewalDate: '2026-07-01',
          monthlyCost: 2500000,
          paymentStatus: 'UNPAID'
        }
      }
    ]
  });
}

export function useTenantDetail(tenantId: string) {
  return useQuery<Tenant>({
    queryKey: ['saas-tenant-detail', tenantId],
    queryFn: () => apiClient<Tenant>(`/api/tenant/${tenantId}`),
    enabled: !!tenantId
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; status: Tenant['status'] }>({
    mutationFn: async ({ id, status }) => {
      await apiClient('/api/tenant/update', {
        method: 'POST',
        body: JSON.stringify({ id, status })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saas-tenants'] });
    }
  });
}
