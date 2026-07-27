'use client';
import React from 'react';
import { useTechnicianActivity } from '../../hooks/useDashboard';

export default function TechnicianTable() {
  const { data: activities, isLoading } = useTechnicianActivity();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'IDLE':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Aktivitas Lapangan Teknisi
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-950/20 border border-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
                <th className="pb-4 font-bold">Nama Teknisi</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Tugas Terakhir / Aktif</th>
                <th className="pb-4 font-bold text-right">WO Selesai</th>
              </tr>
            </thead>
            <tbody>
              {activities?.map((tech) => (
                <tr
                  key={tech.id}
                  className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
                >
                  <td className="py-4 font-bold text-slate-100">{tech.name}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                      getStatusColor(tech.status)
                    }`}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 font-medium">{tech.lastTask}</td>
                  <td className="py-4 text-right font-semibold text-[#7B4DFF]">
                    {tech.completedTasks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
