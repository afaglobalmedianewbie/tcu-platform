'use client';
import { useState } from 'react';
import { Bell, LayoutDashboard, ClipboardList, MessageSquare, User, MapPin, Wrench } from 'lucide-react';

export default function TeknisiPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [activeNav, setActiveNav] = useState('beranda');

  const workOrders = [
    { id: 'WO-101', type: 'Instalasi', priority: 'NORMAL', customer: 'Budi Santoso', address: 'Jl. Merdeka No. 45, Blok A', status: 'PENDING' },
    { id: 'WO-102', type: 'Gangguan', priority: 'URGENT', customer: 'PT Makmur Jaya', address: 'Gedung Cyber Lt. 3, Kuningan', status: 'IN_PROGRESS' },
    { id: 'WO-103', type: 'Survey', priority: 'NORMAL', customer: 'Ani Wijaya', address: 'Perumahan Indah Kav 12', status: 'PENDING' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex flex-col font-inter relative pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0b1120]/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-[#334155]/50 shadow-md">
        <div>
          <h1 className="text-base font-bold font-outfit">Halo, Teknisi Budi</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          <button className="relative p-1.5 bg-[#1e293b]/60 rounded-full border border-[#334155]">
            <Bell size={16} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0b1120]"></span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* WO Summary Strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <div className="snap-start shrink-0 h-[80px] min-w-[120px] bg-violet-600/20 border border-violet-500/30 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden">
            <p className="text-[10px] text-violet-300 font-medium uppercase mb-1">Hari Ini</p>
            <p className="text-2xl font-black font-outfit text-white">4</p>
            <div className="absolute -right-2 -bottom-2 opacity-10 text-violet-300"><ClipboardList size={48} /></div>
          </div>
          <div className="snap-start shrink-0 h-[80px] min-w-[120px] bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden">
            <p className="text-[10px] text-emerald-300 font-medium uppercase mb-1">Selesai</p>
            <p className="text-2xl font-black font-outfit text-white">2</p>
            <div className="absolute -right-2 -bottom-2 opacity-10 text-emerald-300"><ClipboardList size={48} /></div>
          </div>
          <div className="snap-start shrink-0 h-[80px] min-w-[120px] bg-amber-600/20 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-center relative overflow-hidden">
            <p className="text-[10px] text-amber-300 font-medium uppercase mb-1">Pending</p>
            <p className="text-2xl font-black font-outfit text-white">2</p>
            <div className="absolute -right-2 -bottom-2 opacity-10 text-amber-300"><ClipboardList size={48} /></div>
          </div>
          <div className="snap-start shrink-0 h-[80px] min-w-[120px] bg-[#1e293b]/60 border border-[#334155] rounded-xl p-3 flex flex-col justify-center relative overflow-hidden">
            <p className="text-[10px] text-slate-400 font-medium uppercase mb-1">Total Bulan Ini</p>
            <p className="text-2xl font-black font-outfit text-white">45</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Semua', 'Instalasi', 'Gangguan', 'Survey'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab ? 'bg-violet-600 text-white' : 'bg-[#1e293b]/60 border border-[#334155] text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* WO List */}
        <div className="space-y-3">
          {workOrders.filter(wo => activeTab === 'Semua' || wo.type === activeTab).map((wo) => (
            <div key={wo.id} className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
              {/* Top */}
              <div className="flex justify-between items-center">
                <span className="bg-[#0b1120] text-slate-300 px-2.5 py-1 rounded-md text-[0.65rem] font-mono border border-[#334155]">{wo.id}</span>
                <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-md ${wo.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {wo.priority}
                </span>
              </div>
              
              {/* Middle */}
              <div>
                <h3 className="font-semibold text-white font-outfit text-lg leading-tight mb-1">{wo.customer}</h3>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed line-clamp-2">{wo.address}</p>
                </div>
              </div>

              <div className="h-px bg-[#334155]/50 w-full my-1"></div>

              {/* Bottom */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="text-[0.65rem] bg-[#334155]/50 text-slate-300 px-2 py-1 rounded">{wo.type}</span>
                  <span className={`text-[0.65rem] font-medium px-2 py-1 rounded ${wo.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-300'}`}>
                    {wo.status === 'IN_PROGRESS' ? 'Dikerjakan' : 'Menunggu'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-1">
                <button className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-1.5">
                  <Wrench size={14} /> Mulai
                </button>
                <button className="flex-1 bg-[#334155]/50 hover:bg-[#334155] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-[#0b1120]/95 backdrop-blur-md border-t border-[#334155] pb-[env(safe-area-inset-bottom)] z-30">
        <div className="flex justify-around items-center h-[56px] px-2">
          {[
            { id: 'beranda', icon: LayoutDashboard, label: 'Beranda' },
            { id: 'list', icon: ClipboardList, label: 'WO List' },
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'profil', icon: User, label: 'Profil' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-colors ${activeNav === item.id ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <item.icon size={22} className={activeNav === item.id ? 'fill-violet-400/20' : ''} />
              <span className="text-[0.6rem] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
