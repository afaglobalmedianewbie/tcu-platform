'use client';

import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';

export default function StatusGangguanPage() {
  return (
    <main className="min-h-screen bg-[#0b1120] pt-24 md:pt-28 pb-14 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-[2.2rem] sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-100 mb-4">
            Status Sistem
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-['Inter']">
            Pantau status operasional layanan Top Class Universal secara real-time.
          </p>
        </div>

        {/* Global Status Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-400 mb-1">Semua Sistem Berjalan Normal</h2>
            <p className="text-sm text-emerald-400/80">Terakhir diperbarui: Hari ini, 08:00 WIB</p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="mb-14">
          <h3 className="text-xl font-bold font-['Outfit'] text-slate-200 mb-5">Layanan Inti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Koneksi Internet (Backbone)', status: 'operational' },
              { name: 'Sistem Billing & Pembayaran', status: 'operational' },
              { name: 'Portal Pelanggan / Aplikasi', status: 'operational' },
              { name: 'Layanan Support Ticket', status: 'operational' }
            ].map((service, i) => (
              <div key={i} className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 sm:p-5 flex items-center justify-between">
                <span className="font-semibold text-slate-200">{service.name}</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Operasional
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div>
          <h3 className="text-xl font-bold font-['Outfit'] text-slate-200 mb-5">Riwayat Insiden</h3>
          <div className="space-y-4">
            
            <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
                <Clock className="w-4 h-4" />
                <span>15 Agustus 2026</span>
              </div>
              <h4 className="font-bold text-slate-200 mb-2">Pemeliharaan Terjadwal: Area Pangandaran</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Kami melakukan peningkatan kapasitas jaringan pada Distribution Point (DP) area Pangandaran.
              </p>
              <div className="pl-4 border-l-2 border-emerald-500/50 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">Selesai - 04:00 WIB</span>
                  <p className="text-sm text-slate-400 mt-1">Pemeliharaan berhasil diselesaikan. Layanan kembali normal.</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Mulai - 01:00 WIB</span>
                  <p className="text-sm text-slate-400 mt-1">Pemeliharaan dimulai sesuai jadwal.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
                <Clock className="w-4 h-4" />
                <span>10 Agustus 2026</span>
              </div>
              <h4 className="font-bold text-slate-200 mb-2">Tidak ada insiden dilaporkan.</h4>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
