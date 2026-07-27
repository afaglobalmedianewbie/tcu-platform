'use client';
import React from 'react';
import { Tenant } from '../../types/tenant';

interface TenantListProps {
  tenants: Tenant[];
  selectedId: string;
  onSelect: (tenant: Tenant) => void;
}

export default function TenantList({
  tenants,
  selectedId,
  onSelect
}: TenantListProps) {
  const getStatusStyle = (status: Tenant['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'SUSPENDED': return 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col h-full">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Daftar Mitra / Tenant SaaS
      </h3>

      <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
        {tenants.map((tenant) => {
          const isSelected = tenant.id === selectedId;
          return (
            <button
              key={tenant.id}
              onClick={() => onSelect(tenant)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                isSelected
                  ? 'bg-[#7B4DFF]/10 border-[#7B4DFF]/40 shadow-lg shadow-violet-950/20'
                  : 'bg-slate-950/15 border-slate-850/60 hover:border-slate-850 hover:bg-slate-950/30'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-slate-200 truncate max-w-[180px]">
                  {tenant.companyName}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">{tenant.domain}</p>
              </div>

              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                getStatusStyle(tenant.status)
              }`}>
                {tenant.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
