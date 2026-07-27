'use client';

import React, { useState } from 'react';
import { useTickets } from '../../../hooks/useTicket';
import { Ticket } from '../../../types/ticket';
import TicketList from '../../../components/ticket/TicketList';
import TicketDetail from '../../../components/ticket/TicketDetail';
import RoleGuard from '../../../components/rbac/RoleGuard';

export default function AdminTicketPage() {
  const { data: tickets = [], isLoading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN', 'OPERATOR', 'TEKNISI']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Halaman ini khusus untuk tim NOC, Operator, Teknisi, atau Administrator.
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span className="text-[#7B4DFF]">🎫</span> Tiket Keluhan & SLA Tracker
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Pantau laporan aduan gangguan teknis, alokasikan staf, dan awasi batas waktu penyelesaian SLA.
            </p>
          </div>

          <button
            onClick={() => alert('Membuka formulir pembuatan tiket baru...')}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-[#7B4DFF] hover:from-violet-500 hover:to-[#7B4DFF]/90 text-white text-sm font-black rounded-xl shadow-lg shadow-violet-600/25 transition duration-150"
          >
            ＋ Buat Tiket Manual
          </button>
        </header>

        {/* Ticket List Panel */}
        <section className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <h2 className="text-base md:text-lg font-bold text-slate-200 mb-6">
            Daftar Aduan Gangguan Aktif
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-950/20 border border-slate-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <TicketList
              tickets={tickets}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          )}
        </section>

        {/* Ticket Detail Overlay */}
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />

      </div>
    </RoleGuard>
  );
}
