'use client';
import React from 'react';
import { NocMapPoint } from '../../types/noc';

interface NocMapProps {
  points: NocMapPoint[];
}

export default function NocMap({ points }: NocMapProps) {
  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Distribusi Infrastruktur (OLT, Pelanggan, & Teknisi)
      </h3>

      <div className="h-96 rounded-xl bg-slate-950/40 border border-slate-850/60 flex items-center justify-center relative overflow-hidden">
        {/* Simple map vector outline mockup for tracking points */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7B4DFF_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Map grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute inset-0 p-6 flex flex-wrap gap-6 items-center justify-center">
          {points.map((pt) => (
            <div
              key={pt.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex flex-col items-center text-center shadow-lg relative"
            >
              {/* Ping glow marker */}
              <span className={`animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-60 -top-1 -right-1 ${
                pt.status === 'ONLINE' || pt.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />

              <span className="text-2xl mb-2">
                {pt.type === 'OLT' ? '🖥️' : pt.type === 'TECHNICIAN' ? '📍' : '🏠'}
              </span>
              <h4 className="text-xs font-bold text-slate-200">{pt.name}</h4>
              <span className="text-[9px] text-slate-500 font-semibold mt-1">
                {pt.type} ({pt.status})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
