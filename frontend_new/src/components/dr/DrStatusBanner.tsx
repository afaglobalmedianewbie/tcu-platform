'use client';
import React from 'react';
import { useDRStore } from '../../store/drStore';

export default function DrStatusBanner() {
  const { replicationStatus } = useDRStore();

  const isHealthy = replicationStatus === 'SYNCED';

  return (
    <div className={`p-4 md:p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border backdrop-blur-md transition-all duration-300 ${
      isHealthy
        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
        : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
    }`}>
      <div className="flex items-center gap-4">
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isHealthy ? 'bg-emerald-400' : 'bg-rose-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
          }`}></span>
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-100">
            Replikasi Database Multi-Region
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {isHealthy
              ? 'Sinkronisasi real-time Jakarta ⇆ Singapura berjalan lancar.'
              : 'Peringatan: Hubungan replikasi rusak. Sistem berjalan di simpul cadangan (Split-Brain).'}
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${
          isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {isHealthy ? 'SYNCED' : 'CRITICAL'}
        </span>
      </div>
    </div>
  );
}
