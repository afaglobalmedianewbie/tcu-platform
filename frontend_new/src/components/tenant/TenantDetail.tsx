'use client';
import React from 'react';
import { Tenant } from '../../types/tenant';
import { useUpdateTenant } from '../../hooks/useTenant';

interface TenantDetailProps {
  tenant: Tenant | null;
  onClose: () => void;
}

export default function TenantDetail({ tenant, onClose }: TenantDetailProps) {
  const updateMutation = useUpdateTenant();

  if (!tenant) {
    return (
      <div className="h-[450px] bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs md:text-sm">
        Pilih salah satu tenant di sebelah kiri untuk melihat rincian alokasi.
      </div>
    );
  }

  const handleToggleStatus = () => {
    const nextStatus = tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (confirm(`Apakah Anda yakin ingin mengubah status tenant ${tenant.companyName} menjadi ${nextStatus}?`)) {
      updateMutation.mutate({ id: tenant.id, status: nextStatus });
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tenant Profile</span>
          <h3 className="text-base md:text-lg font-black text-slate-100 mt-0.5">{tenant.companyName}</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition border ${
              tenant.status === 'ACTIVE'
                ? 'bg-rose-600/15 border-rose-500/25 text-rose-400 hover:bg-rose-600 hover:text-white'
                : 'bg-emerald-600/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {tenant.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-slate-500 block mb-0.5">Tenant ID</span>
          <span className="text-slate-200 font-bold">{tenant.id}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Custom Domain</span>
          <span className="text-slate-200 font-semibold">{tenant.domain}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 mt-2">Email Administrator</span>
          <span className="text-[#7B4DFF] font-bold">{tenant.adminEmail}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 mt-2">Terdaftar Sejak</span>
          <span className="text-slate-200 font-medium">{tenant.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
