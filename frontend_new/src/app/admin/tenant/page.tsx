'use client';

import React, { useState } from 'react';
import { useTenants } from '../../../hooks/useTenant';
import { Tenant } from '../../../types/tenant';
import TenantList from '../../../components/tenant/TenantList';
import TenantDetail from '../../../components/tenant/TenantDetail';
import TenantResources from '../../../components/tenant/TenantResources';
import TenantBilling from '../../../components/tenant/TenantBilling';
import RoleGuard from '../../../components/rbac/RoleGuard';

export default function AdminTenantPage() {
  const { data: tenants = [], isLoading } = useTenants();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Halaman ini khusus untuk Administrator Utama (Superadmin) PT Top Class Universal.
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span className="text-[#7B4DFF]">🏢</span> Multi-Tenant SaaS Manager
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Kelola entitas anak perusahaan (tenants), lisensi alokasi user PPPoE, dan informasi invoice bulanan mitra.
            </p>
          </div>

          <button
            onClick={() => alert('Membuka formulir pendaftaran tenant/mitra baru...')}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-[#7B4DFF] hover:from-violet-500 hover:to-[#7B4DFF]/90 text-white text-sm font-black rounded-xl shadow-lg shadow-violet-600/25 transition duration-150"
          >
            ＋ Registrasi Tenant Baru
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            {isLoading ? (
              <div className="h-96 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
            ) : (
              <TenantList
                tenants={tenants}
                selectedId={selectedTenant?.id || ''}
                onSelect={handleSelectTenant}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <TenantDetail
              tenant={selectedTenant}
              onClose={() => setSelectedTenant(null)}
            />

            {selectedTenant && (
              <>
                <TenantResources resources={selectedTenant.resources} />
                <TenantBilling billing={selectedTenant.billing} />
              </>
            )}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
