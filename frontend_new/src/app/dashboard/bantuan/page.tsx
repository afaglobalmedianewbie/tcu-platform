'use client';

import React, { useState } from 'react';
import { Navigation } from '../page';
import { HelpCircle, MessageSquare, Plus, Clock, Search, Send, X } from 'lucide-react';

export default function BantuanPage() {
  const [showNew, setShowNew] = useState(false);

  const tickets = [
    { id: 'TKT-001', title: 'Internet Sering Putus', status: 'Terbuka', date: 'Hari ini', desc: 'Koneksi internet sering terputus sejak semalam, lampu LOS merah.' },
    { id: 'TKT-002', title: 'Tanya Upgrade Paket', status: 'Selesai', date: '3 hari lalu', desc: 'Bagaimana cara upgrade ke paket Gold 100 Mbps?' },
  ];

  return (
    <div className="min-h-[100svh] bg-[#0b1120] font-sans text-slate-200 md:pl-[220px] pb-[80px] md:pb-0">
      <Navigation />
      
      <main className="p-6 lg:p-8 max-w-5xl mx-auto animate-in fade-in duration-500 flex flex-col md:flex-row gap-6 h-[calc(100svh-80px)] md:h-[100svh]">
        
        {/* Left List */}
        <div className="w-full md:w-1/3 flex flex-col h-full bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl overflow-hidden shrink-0">
          <div className="p-5 border-b border-[#334155]">
            <h2 className="text-xl font-black text-white font-['Outfit'] mb-4 flex items-center justify-between">
              Tiket Bantuan
              <button onClick={() => setShowNew(true)} className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white hover:bg-violet-500 transition-colors md:hidden">
                <Plus size={18} />
              </button>
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari tiket..." className="w-full h-[40px] pl-9 pr-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-sm outline-none focus:border-violet-500" />
            </div>
            <button onClick={() => setShowNew(true)} className="hidden md:flex w-full mt-4 h-[44px] bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-xl font-bold text-white items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Plus size={18} /> Buat Tiket Baru
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {tickets.map((ticket, i) => (
              <div key={ticket.id} className={`p-4 rounded-xl cursor-pointer border transition-all ${i === 0 ? 'bg-violet-500/10 border-violet-500/50' : 'bg-[#0b1120]/50 border-[#334155] hover:border-violet-500/30'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ticket.status === 'Terbuka' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {ticket.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {ticket.date}</span>
                </div>
                <h4 className="font-bold text-slate-200 text-sm mb-1">{ticket.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{ticket.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat/Detail Area (Hidden on mobile unless selected, simplified here for demo) */}
        <div className="hidden md:flex flex-1 flex-col bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl overflow-hidden h-full">
          <div className="p-5 border-b border-[#334155] flex justify-between items-center bg-[#0b1120]/50">
            <div>
              <div className="text-xs text-slate-400 mb-1">TKT-001</div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">Internet Sering Putus</h2>
            </div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">Terbuka</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">B</div>
              <div>
                <div className="bg-[#0b1120] border border-[#334155] rounded-2xl rounded-tl-none p-4 text-sm text-slate-300 shadow">
                  Koneksi internet sering terputus sejak semalam, lampu LOS merah. Mohon dibantu cek.
                </div>
                <div className="text-[0.65rem] text-slate-500 mt-1 ml-1">Hari ini, 09:00</div>
              </div>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"><HelpCircle size={16}/></div>
              <div className="flex flex-col items-end">
                <div className="bg-violet-600 text-white rounded-2xl rounded-tr-none p-4 text-sm shadow">
                  Baik Bapak Budi, teknisi kami akan mengecek jaringan di area Bapak. Mohon ditunggu updatenya.
                </div>
                <div className="text-[0.65rem] text-slate-500 mt-1 mr-1">Hari ini, 09:15</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#334155] bg-[#0b1120]/50 flex gap-3">
            <input type="text" placeholder="Ketik balasan..." className="flex-1 h-[48px] px-4 bg-[#1e293b] border border-[#334155] rounded-xl text-sm outline-none focus:border-violet-500" />
            <button className="w-[48px] h-[48px] bg-violet-600 rounded-xl flex items-center justify-center text-white hover:bg-violet-500 transition-colors shrink-0">
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Create Modal Mobile (Simplified) */}
        {showNew && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in md:hidden">
            <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="flex justify-between items-center p-5 border-b border-[#334155]">
                <h3 className="font-bold text-lg font-['Outfit'] text-white">Buat Tiket Baru</h3>
                <button onClick={() => setShowNew(false)} className="text-slate-400"><X size={20}/></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">Judul Masalah</label>
                  <input type="text" className="w-full h-[48px] px-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">Deskripsi</label>
                  <textarea rows={4} className="w-full p-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 outline-none resize-none"></textarea>
                </div>
                <button onClick={() => setShowNew(false)} className="w-full h-[48px] bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-xl font-bold text-white mt-2">Kirim Tiket</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
