'use client';
import React from 'react';

interface TrafficChartProps {
  spikes: { timestamp: string; loadGbps: number; isSpike: boolean }[];
}

export default function TrafficChart({ spikes }: TrafficChartProps) {
  const maxLoad = Math.max(...spikes.map(s => s.loadGbps)) || 1;

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Distribusi AI Traffic Load & Lonjakan Paket (Real-time)
      </h3>

      <div className="flex justify-between items-end h-44 gap-4 mt-6">
        {spikes.map((item, idx) => {
          const heightPct = (item.loadGbps / maxLoad) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] md:text-xs font-bold text-slate-400">
                {item.loadGbps} Gbps
              </span>
              <div className="w-full bg-slate-950/50 rounded-lg overflow-hidden h-32 flex items-end">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    item.isSpike
                      ? 'bg-rose-500 shadow-lg shadow-rose-500/20'
                      : 'bg-[#7B4DFF] shadow-lg shadow-[#7B4DFF]/15'
                  }`}
                />
              </div>
              <span className="text-[10px] md:text-xs text-slate-500 font-bold tracking-tight">
                {item.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
