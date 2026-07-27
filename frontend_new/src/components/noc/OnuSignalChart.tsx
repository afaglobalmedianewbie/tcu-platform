'use client';
import React from 'react';
import { OnuSignalData } from '../../types/noc';

interface OnuSignalChartProps {
  onuSignals: OnuSignalData[];
}

export default function OnuSignalChart({ onuSignals }: OnuSignalChartProps) {
  // Safe math for chart percentages
  const totalOnus = onuSignals.reduce((acc, curr) => acc + curr.count, 0) || 1;

  const getSignalColor = (range: string) => {
    if (range.includes('-15')) return 'bg-emerald-500';
    if (range.includes('-21')) return 'bg-blue-500';
    if (range.includes('-25')) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Distribusi Redaman Sinyal ONU
      </h3>

      <div className="space-y-4">
        {onuSignals.map((sig, i) => {
          const pct = (sig.count / totalOnus) * 100;
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <span className="text-slate-300">{sig.range}</span>
                <span className="text-[#7B4DFF]">
                  {sig.count.toLocaleString('id-ID')} Perangkat ({pct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-950/45 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    getSignalColor(sig.range)
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
