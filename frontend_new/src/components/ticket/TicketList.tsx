'use client';
import React from 'react';
import { Ticket } from '../../types/ticket';
import SlaTimer from './SlaTimer';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export default function TicketList({ tickets, onSelectTicket }: TicketListProps) {
  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'OPEN': return 'text-sky-400';
      case 'PROCESSING': return 'text-amber-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
            <th className="pb-4 font-bold">No. Tiket</th>
            <th className="pb-4 font-bold">Subject Masalah</th>
            <th className="pb-4 font-bold">Kategori</th>
            <th className="pb-4 font-bold">Prioritas</th>
            <th className="pb-4 font-bold">SLA Timer</th>
            <th className="pb-4 font-bold">Penanggung Jawab</th>
            <th className="pb-4 font-bold">Status</th>
            <th className="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
            >
              <td className="py-4 font-bold text-slate-100">{t.id}</td>
              <td className="py-4 font-bold text-slate-200 max-w-[200px] truncate" title={t.title}>
                {t.title}
              </td>
              <td className="py-4 text-slate-400 font-medium text-xs">{t.category}</td>
              <td className="py-4">
                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                  getPriorityColor(t.priority)
                }`}>
                  {t.priority}
                </span>
              </td>
              <td className="py-4">
                {t.status !== 'RESOLVED' ? (
                  <SlaTimer targetDate={t.slaLimit} />
                ) : (
                  <span className="text-slate-500 font-semibold text-xs">SLA Selesai</span>
                )}
              </td>
              <td className="py-4 text-slate-300 font-medium text-xs">
                {t.assignedTo || <span className="text-slate-500 italic">Belum Ditugaskan</span>}
              </td>
              <td className="py-4">
                <span className={`text-xs font-bold ${getStatusColor(t.status)}`}>
                  {t.status}
                </span>
              </td>
              <td className="py-4 text-right">
                <button
                  onClick={() => onSelectTicket(t)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg transition"
                >
                  Kelola
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
