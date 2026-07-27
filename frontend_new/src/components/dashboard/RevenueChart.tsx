'use client';
import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

export default function RevenueChart() {
  const { data } = useDashboard();

  const history = data?.revenueHistory || [];

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-200">
          Pendapatan & Laju Pertumbuhan
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-[#7B4DFF]" />
            <span>Pendapatan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span>Pertumbuhan</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between relative pl-4 pr-4 border-b border-slate-800">
        {history.map((h, i) => {
          // Normalize height max 200px
          const maxAmount = 800000000;
          const pctHeight = (h.amount / maxAmount) * 100;
          return (
            <div key={i} className="flex flex-col items-center group relative w-12">
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/90 border border-slate-800 text-[10px] text-slate-100 rounded-lg p-2 z-10 w-28 text-center pointer-events-none">
                Rp{(h.amount / 1000000).toFixed(0)}Jt (+{h.growth}%)
              </div>

              {/* Bar */}
              <div
                style={{ height: `${pctHeight}%` }}
                className="w-8 rounded-t-lg bg-gradient-to-t from-violet-600/30 to-[#7B4DFF] group-hover:from-violet-600/50 group-hover:to-[#7b4dff]/90 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              </div>

              {/* Label */}
              <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
                {h.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
