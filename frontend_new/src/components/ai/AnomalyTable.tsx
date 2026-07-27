'use client';
import React from 'react';

interface Anomaly {
  id: string;
  timestamp: string;
  ipSource: string;
  type: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

interface AnomalyTableProps {
  anomalies: Anomaly[];
}

export default function AnomalyTable({ anomalies }: AnomalyTableProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Log Anomali & Trafik Tidak Wajar
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
              <th className="pb-4 font-bold">Waktu</th>
              <th className="pb-4 font-bold">IP Asal / Sumber</th>
              <th className="pb-4 font-bold">Jenis Anomali</th>
              <th className="pb-4 font-bold">Tingkat Bahaya</th>
              <th className="pb-4 font-bold text-right">Keterangan Aktivitas</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((anm) => (
              <tr
                key={anm.id}
                className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
              >
                <td className="py-4 text-slate-400 font-semibold">{anm.timestamp}</td>
                <td className="py-4 font-bold text-slate-100">{anm.ipSource}</td>
                <td className="py-4 text-[#7B4DFF] font-bold text-xs">{anm.type}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                    getSeverityColor(anm.severity)
                  }`}>
                    {anm.severity}
                  </span>
                </td>
                <td className="py-4 text-slate-400 text-xs md:text-sm max-w-sm truncate text-right font-medium" title={anm.description}>
                  {anm.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
