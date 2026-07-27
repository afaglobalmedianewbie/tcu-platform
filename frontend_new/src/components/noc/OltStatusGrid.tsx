'use client';
import React from 'react';
import { OltDevice } from '../../types/noc';

interface OltStatusGridProps {
  olts: OltDevice[];
}

export default function OltStatusGrid({ olts }: OltStatusGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'WARNING': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      default: return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {olts.map((olt) => (
        <div
          key={olt.id}
          className={`p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-950/15 ${
            getStatusColor(olt.status)
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              OLT Device
            </span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-black/25">
              {olt.status}
            </span>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-100 truncate">
            {olt.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{olt.ip}</p>

          <div className="border-t border-slate-800/60 pt-4 mt-4 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Uptime</span>
              <span className="text-slate-300 font-semibold">{olt.uptime}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">CPU / Temp</span>
              <span className="text-slate-300 font-semibold">{olt.cpu}% / {olt.temp}°C</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
