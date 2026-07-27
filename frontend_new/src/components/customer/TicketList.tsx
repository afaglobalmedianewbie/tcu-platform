'use client';
import React from 'react';

interface Ticket {
  id: string;
  category: string;
  subject: string;
  status: 'OPEN' | 'PROCESSING' | 'RESOLVED';
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'PROCESSING':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Riwayat Tiket Keluhan
      </h3>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-xs md:text-sm text-slate-500 text-center py-6">
            Tidak ada riwayat tiket aduan.
          </p>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-950/20 border border-slate-850/60 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-200 hover:border-slate-800"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400">{t.id}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold uppercase">
                    {t.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mt-2 break-all">
                  {t.subject}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1.5">{t.createdAt}</p>
              </div>

              <div className="flex items-center">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                  getStatusColor(t.status)
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
