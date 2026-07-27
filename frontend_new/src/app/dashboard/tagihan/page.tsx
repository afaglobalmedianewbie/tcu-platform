'use client';

import React, { useState } from 'react';
import { Navigation } from '../page'; // reusing the shell
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

export default function TagihanPage() {
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices = [
    { id: 'INV-20231001', date: '01 Okt 2023', due: '10 Okt 2023', amount: 'Rp 299.000', status: 'Belum Bayar' },
    { id: 'INV-20230901', date: '01 Sep 2023', due: '10 Sep 2023', amount: 'Rp 299.000', status: 'Lunas' },
    { id: 'INV-20230801', date: '01 Ags 2023', due: '10 Ags 2023', amount: 'Rp 299.000', status: 'Lunas' },
  ];

  const filteredInvoices = invoices.filter(inv => filter === 'Semua' || inv.status === filter);

  return (
    <div className="min-h-[100svh] bg-[#0b1120] font-sans text-slate-200 md:pl-[220px] pb-[80px] md:pb-0">
      <Navigation />
      
      <main className="p-6 lg:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">Tagihan</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola riwayat tagihan dan pembayaran Anda</p>
        </div>

        {/* Outstanding Card */}
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#2563eb] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl shadow-violet-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-sm text-white/80 font-bold uppercase tracking-widest mb-2">Tagihan Bulan Ini</div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">Rp 299.000</div>
              <div className="text-sm text-white/90 mt-2 flex items-center gap-2">
                <AlertCircle size={16} /> Jatuh tempo: 10 Okt 2023 (INV-20231001)
              </div>
            </div>
            <button 
              onClick={() => { setSelectedInvoice('INV-20231001'); setShowModal(true); }}
              className="w-full md:w-auto h-[48px] px-8 bg-white text-violet-600 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 snap-x">
          {['Semua', 'Belum Bayar', 'Lunas'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 h-[40px] rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-violet-600 text-white' : 'bg-[#1e293b] border border-[#334155] text-slate-400 hover:text-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Invoice List */}
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b border-[#334155] bg-[#0b1120]/50 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-2">No. Invoice</div>
            <div>Jatuh Tempo</div>
            <div>Jumlah</div>
            <div className="text-right">Status</div>
          </div>
          
          <div className="divide-y divide-[#334155]">
            {filteredInvoices.map(inv => (
              <div key={inv.id} className="flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-4 p-5 items-start md:items-center hover:bg-[#334155]/20 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${inv.status === 'Lunas' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">{inv.id}</div>
                    <div className="text-xs text-slate-400">{inv.date}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-400 md:text-slate-300 ml-13 md:ml-0"><span className="md:hidden">Jatuh Tempo: </span>{inv.due}</div>
                <div className="font-bold text-slate-200 ml-13 md:ml-0"><span className="md:hidden">Jumlah: </span>{inv.amount}</div>
                <div className="w-full md:w-auto text-left md:text-right ml-13 md:ml-0 mt-2 md:mt-0 flex items-center md:justify-end gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${inv.status === 'Lunas' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {inv.status}
                  </span>
                  {inv.status !== 'Lunas' && (
                    <button onClick={() => { setSelectedInvoice(inv.id); setShowModal(true); }} className="text-xs font-bold text-violet-400 hover:text-violet-300">Bayar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-[#334155]">
                <h3 className="font-bold text-lg font-['Outfit'] text-white">Upload Bukti Pembayaran</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm text-slate-300">Invoice: <span className="font-bold text-white">{selectedInvoice}</span></div>
                <div className="border-2 border-dashed border-[#334155] rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-violet-500 transition-colors cursor-pointer bg-[#0b1120]/50">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-400"><UploadCloud size={24} /></div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-200">Klik atau drag file ke sini</div>
                    <div className="text-xs text-slate-400 mt-1">PNG, JPG, PDF (Max. 5MB)</div>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-full h-[48px] bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-xl font-bold text-white mt-4">Kirim Bukti</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
