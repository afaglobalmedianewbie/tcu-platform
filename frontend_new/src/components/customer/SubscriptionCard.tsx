'use client';
import React from 'react';

interface SubscriptionCardProps {
  subscription: {
    planName: string;
    speedLimit: string;
    price: number;
    renewalDate: string;
  };
}

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Paket Langganan
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {subscription.speedLimit} Mbps
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-tight">
          {subscription.planName}
        </h3>
        <p className="text-sm font-semibold text-[#7B4DFF] mt-2">
          {formatRupiah(subscription.price)} / bulan
        </p>
      </div>

      <div className="border-t border-slate-800/60 pt-4 mt-6 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Tanggal Perpanjangan</span>
        <span className="text-slate-300 font-semibold">{subscription.renewalDate}</span>
      </div>
    </div>
  );
}
