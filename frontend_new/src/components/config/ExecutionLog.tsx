'use client';
import React from 'react';
import { ExecutionLog as Log } from '../../types/config';
import { useRollbackTemplate } from '../../hooks/useConfig';

interface ExecutionLogProps {
  logs: Log[];
}

export default function ExecutionLog({ logs }: ExecutionLogProps) {
  const rollbackMutation = useRollbackTemplate();

  const handleRollback = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan (rollback) konfigurasi pada log ${id}?`)) {
      rollbackMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: Log['status']) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'FAILED': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Log Penerapan Konfigurasi (Real-time)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
              <th className="pb-4 font-bold">Waktu</th>
              <th className="pb-4 font-bold">Nama Template</th>
              <th className="pb-4 font-bold">Target</th>
              <th className="pb-4 font-bold">Operator</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
              >
                <td className="py-4 text-slate-400 font-semibold">{log.timestamp}</td>
                <td className="py-4 font-bold text-slate-200 truncate max-w-[200px]" title={log.templateName}>
                  {log.templateName}
                </td>
                <td className="py-4 text-[#7B4DFF] font-semibold text-xs">{log.target}</td>
                <td className="py-4 text-slate-300 font-medium text-xs">{log.operator}</td>
                <td className="py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                    getStatusBadge(log.status)
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  {log.status === 'SUCCESS' && (
                    <button
                      onClick={() => handleRollback(log.id)}
                      className="py-1 px-2.5 bg-rose-600/15 border border-rose-500/25 hover:bg-rose-600 text-rose-400 hover:text-white text-[10px] font-bold rounded-lg transition"
                    >
                      Rollback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
