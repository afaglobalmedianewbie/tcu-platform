'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, CreditCard, HelpCircle, User, LogOut, Zap, Clock, CheckCircle2, Ticket, MessageSquare, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Extracted Navigation Component for reuse
export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tagihan', href: '/dashboard/tagihan', icon: CreditCard },
    { name: 'Bantuan', href: '/dashboard/bantuan', icon: HelpCircle },
    { name: 'Profil', href: '/dashboard/profil', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tcu_token');
    localStorage.removeItem('tcu_user');
    router.push('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] h-[100svh] fixed left-0 top-0 bg-[#1e293b]/80 backdrop-blur-lg border-r border-[#334155] p-4 z-50">
        <div className="flex items-center gap-3 px-2 mb-8 mt-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-500 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg">TCU</div>
          <span className="font-['Outfit'] font-bold text-white text-lg leading-tight">Top Class<br/>Universal</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-violet-500/10 text-violet-400 border-l-2 border-violet-500' : 'text-slate-400 hover:bg-[#334155]/50 hover:text-slate-200'}`}>
                <Icon size={18} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-auto mb-4">
          <LogOut size={18} />
          <span className="font-semibold text-sm">Keluar</span>
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[64px] pb-safe bg-[#1e293b]/90 backdrop-blur-lg border-t border-[#334155] z-50 flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${isActive ? 'text-violet-400' : 'text-slate-400'}`}>
              <Icon size={20} className={isActive ? 'animate-in zoom-in' : ''} />
              <span className="text-[0.65rem] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tcu_token');
    if (!token) router.push('/login');
    else setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-[100svh] bg-[#0b1120] flex items-center justify-center"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-[100svh] bg-[#0b1120] font-sans text-slate-200 md:pl-[220px] pb-[80px] md:pb-0">
      <Navigation />
      
      <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">Selamat Datang, Budi!</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> AKTIF
            </span>
            <span className="text-sm text-slate-400 font-semibold">Paket Silver 50 Mbps</span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"><CheckCircle2 size={48} className="text-emerald-500" /></div>
            <div className="relative z-10">
              <div className="text-[0.7rem] uppercase tracking-widest text-slate-500 font-bold mb-1">Status Layanan</div>
              <div className="text-2xl font-black text-white">Normal</div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"><CreditCard size={48} className="text-blue-500" /></div>
            <div className="relative z-10">
              <div className="text-[0.7rem] uppercase tracking-widest text-slate-500 font-bold mb-1">Tagihan Bulan Ini</div>
              <div className="text-xl sm:text-2xl font-black text-white">Rp 299.000</div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"><Zap size={48} className="text-violet-500" /></div>
            <div className="relative z-10">
              <div className="text-[0.7rem] uppercase tracking-widest text-slate-500 font-bold mb-1">Kecepatan Paket</div>
              <div className="text-2xl font-black text-white">50 Mbps</div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"><Clock size={48} className="text-amber-500" /></div>
            <div className="relative z-10">
              <div className="text-[0.7rem] uppercase tracking-widest text-slate-500 font-bold mb-1">Sisa Hari</div>
              <div className="text-2xl font-black text-white">28 Hari</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="h-[80px] bg-[#1e293b]/60 border border-[#334155] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all group">
              <CreditCard size={24} className="text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300">Bayar Tagihan</span>
            </button>
            <button className="h-[80px] bg-[#1e293b]/60 border border-[#334155] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group">
              <Ticket size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300">Buat Tiket</span>
            </button>
            <button className="h-[80px] bg-[#1e293b]/60 border border-[#334155] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group">
              <Zap size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300">Cek Speed</span>
            </button>
            <button className="h-[80px] bg-[#1e293b]/60 border border-[#334155] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-green-500/10 hover:border-green-500/50 transition-all group">
              <MessageSquare size={24} className="text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300">WA Support</span>
            </button>
          </div>
        </div>

        {/* Info Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-bl-full blur-2xl"></div>
            <h2 className="text-lg font-black text-white font-['Outfit'] mb-4">Tagihan Terakhir</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#334155]">
                <div>
                  <div className="font-bold text-slate-200">INV-20231001</div>
                  <div className="text-xs text-slate-400">Jatuh tempo: 10 Okt 2023</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-violet-400">Rp 299.000</div>
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded inline-block mt-1">Belum Lunas</div>
                </div>
              </div>
              <button className="w-full h-[44px] bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-xl font-bold text-white shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all">
                Bayar Sekarang
              </button>
            </div>
          </div>

          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6">
            <h2 className="text-lg font-black text-white font-['Outfit'] mb-4">Aktivitas Terbaru</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#334155] before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#334155] bg-[#1e293b] text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <CheckCircle2 size={18} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#334155] bg-[#0b1120]/50 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-slate-200">Pembayaran Berhasil</div>
                    <time className="text-xs text-slate-500">1 Sep</time>
                  </div>
                  <div className="text-xs text-slate-400">Pembayaran untuk INV-20230901 telah diterima.</div>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#334155] bg-[#1e293b] text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Ticket size={18} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#334155] bg-[#0b1120]/50 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-slate-200">Tiket Ditutup</div>
                    <time className="text-xs text-slate-500">28 Ags</time>
                  </div>
                  <div className="text-xs text-slate-400">Masalah koneksi lambat telah diselesaikan teknisi.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
