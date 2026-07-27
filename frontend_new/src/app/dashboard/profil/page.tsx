'use client';

import React, { useState } from 'react';
import { Navigation } from '../page';
import { User, Mail, Phone, Lock, Shield, Edit2, LogOut, Save, X } from 'lucide-react';

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="min-h-[100svh] bg-[#0b1120] font-sans text-slate-200 md:pl-[220px] pb-[80px] md:pb-0">
      <Navigation />
      
      <main className="p-6 lg:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">Profil Akun</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola informasi pribadi dan keamanan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Profil Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-violet-600 to-blue-500 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg mb-4">
                B
              </div>
              <h2 className="text-xl font-black text-white font-['Outfit']">Budi Santoso</h2>
              <p className="text-sm text-slate-400 mb-4">budi@example.com</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-bold uppercase tracking-wider">
                Customer VIP
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#334155] text-left">
                <div className="text-[0.7rem] uppercase tracking-widest text-slate-500 font-bold mb-1">ID Pelanggan</div>
                <div className="font-mono text-slate-200">TCU-2023-8891</div>
              </div>
            </div>

            <button className="w-full h-[48px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <LogOut size={18} /> Keluar Akun
            </button>
          </div>

          {/* Main Form */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white font-['Outfit']">Informasi Pribadi</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#334155] flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-500 transition-all"
                >
                  {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                      <input type="text" defaultValue="Budi Santoso" disabled={!isEditing} className="w-full h-[48px] pl-10 pr-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all disabled:opacity-60" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">No. HP</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                      <input type="tel" defaultValue="08123456789" disabled={!isEditing} className="w-full h-[48px] pl-10 pr-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all disabled:opacity-60" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                    <input type="email" defaultValue="budi@example.com" disabled={!isEditing} className="w-full h-[48px] pl-10 pr-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase text-[0.7rem] tracking-widest text-slate-500 font-bold">Alamat Pemasangan</label>
                  <textarea defaultValue="Jl. Merdeka No. 45, Jakarta Selatan" rows={3} disabled={!isEditing} className="w-full p-4 bg-[#0b1120]/50 border border-[#334155] rounded-xl text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all resize-none disabled:opacity-60"></textarea>
                </div>

                {isEditing && (
                  <button className="h-[48px] px-6 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-xl font-bold text-white shadow-lg flex items-center gap-2 mt-4 ml-auto">
                    <Save size={18} /> Simpan Perubahan
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-6 flex items-center gap-2"><Shield size={20} className="text-violet-400"/> Keamanan Akun</h3>
              
              <div className="flex items-center justify-between py-4 border-b border-[#334155]">
                <div>
                  <div className="font-bold text-slate-200">Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-slate-400 mt-1">Tingkatkan keamanan dengan verifikasi 2 langkah</div>
                </div>
                <button 
                  onClick={() => setTwoFa(!twoFa)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${twoFa ? 'bg-emerald-500' : 'bg-[#334155]'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${twoFa ? 'left-[26px]' : 'left-0.5'}`}></div>
                </button>
              </div>

              <div className="pt-6">
                <button className="text-sm font-bold text-violet-400 hover:text-violet-300 flex items-center gap-2">
                  <Lock size={16} /> Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


