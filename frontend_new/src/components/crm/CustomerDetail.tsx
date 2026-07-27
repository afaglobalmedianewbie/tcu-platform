'use client';
import React from 'react';
import { CustomerDetailData } from '../../types/crm';

interface CustomerDetailProps {
  customer: CustomerDetailData | null;
  onClose: () => void;
}

export default function CustomerDetail({ customer, onClose }: CustomerDetailProps) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Customer Details</span>
            <h3 className="text-xl font-black text-slate-100 mt-1">{customer.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">Customer ID</span>
              <span className="text-slate-200 font-bold">{customer.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">No. Telepon</span>
              <span className="text-slate-200 font-semibold">{customer.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">Email Aktif</span>
              <span className="text-slate-200 font-semibold">{customer.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">PPPoE Username</span>
              <span className="text-[#7B4DFF] font-black">{customer.pppoeUsername}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">Profile Bandwidth</span>
              <span className="text-slate-200 font-semibold">{customer.bandwidthProfile}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Alamat Pemasangan</span>
              <span className="text-slate-200 font-medium truncate block max-w-[200px]" title={customer.address}>
                {customer.address}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">ONU Redaman Sinyal</span>
              <span className="text-slate-200 font-bold">{customer.onuRxPower} dBm</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Status Koneksi</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase mt-1 ${
                customer.connectionStatus === 'ONLINE'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {customer.connectionStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Tutup Rincian
          </button>
        </div>

      </div>
    </div>
  );
}
