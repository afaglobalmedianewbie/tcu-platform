'use client';
import React from 'react';

interface InternetStatusProps {
  status: 'ONLINE' | 'OFFLINE' | 'ISOLATED';
}

export default function InternetStatus({ status }: InternetStatusProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'ONLINE':
        return {
          bg: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-500 shadow-emerald-500/50',
          label: 'Layanan Aktif / Online'
        };
      case 'ISOLATED':
        return {
          bg: 'bg-amber-500/5 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-500 shadow-amber-500/50',
          label: 'Terisolir (Tunggakan)'
        };
      default:
        return {
          bg: 'bg-rose-500/5 border-rose-500/20 text-rose-400',
          dot: 'bg-rose-500 shadow-rose-500/50',
          label: 'Layanan Terputus / Offline'
        };
    }
  };

  const style = getStatusStyles();

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-md flex items-center justify-between transition-all duration-300 ${
      style.bg
    }`}>
      <div className="flex items-center gap-4">
        <div className="relative flex h-3.5 w-3.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === 'ONLINE' ? 'bg-emerald-400' : status === 'ISOLATED' ? 'bg-amber-400' : 'bg-rose-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${style.dot} shadow-lg`} />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Status Sambungan
          </h4>
          <h3 className="text-lg md:text-xl font-black text-slate-100 mt-0.5">
            {style.label}
          </h3>
        </div>
      </div>
    </div>
  );
}
