'use client';
import React from 'react';

interface SignalCardProps {
  rxPower: number;
  status: 'EXCELLENT' | 'GOOD' | 'POOR' | 'LOS';
}

export default function SignalCard({ rxPower, status }: SignalCardProps) {
  const getSignalColor = () => {
    switch (status) {
      case 'EXCELLENT':
        return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
      case 'GOOD':
        return 'text-blue-400 bg-blue-500/5 border-blue-500/20';
      case 'POOR':
        return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
      default:
        return 'text-rose-400 bg-rose-500/5 border-rose-500/20';
    }
  };

  return (
    <div className={`p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/10 ${
      getSignalColor()
    }`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-black tracking-wider uppercase">
          Kekuatan Sinyal (Rx)
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/25">
          {status}
        </span>
      </div>
      <div className="text-3xl font-black text-slate-100 tracking-tight">
        {rxPower} <span className="text-base font-semibold text-slate-400">dBm</span>
      </div>
      <p className="text-[10px] md:text-xs text-slate-400 mt-2">
        Redaman optimal berkisar antara -15 dBm s/d -25 dBm.
      </p>
    </div>
  );
}
