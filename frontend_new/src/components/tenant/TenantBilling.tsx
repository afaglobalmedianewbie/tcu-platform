'use client';
import React from 'react';
import { TenantBillingInfo } from '../../types/tenant';

interface TenantBillingProps {
  billing: TenantBillingInfo;
}

export default function TenantBilling({ billing }: TenantBillingProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'SUSPENDED':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Informasi Billing & Paket SaaS
      </h3>

      <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
        <div>
          <span className="text-slate-500 block mb-0.5">Nama Paket Langganan</span>
          <span className="text-slate-200 font-bold">{billing.planName}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Metrik Biaya Bulanan</span>
          <span className="text-[#7B4DFF] font-black">{formatRupiah(billing.monthlyCost)}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 mt-2">Tanggal Perpanjangan</span>
          <span className="text-slate-200 font-semibold">{billing.nextRenewalDate}</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5 mt-2">Status Pembayaran</span>
          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mt-1 ${
            getPaymentBadge(billing.paymentStatus)
          }`}>
            {billing.paymentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
