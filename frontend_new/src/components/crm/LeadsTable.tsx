'use client';
import React from 'react';
import { Lead } from '../../types/crm';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onSelectLead }: LeadsTableProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'CONTACTED': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
            <th className="pb-4 font-bold">No. Leads</th>
            <th className="pb-4 font-bold">Nama Lengkap</th>
            <th className="pb-4 font-bold">Email / Telp</th>
            <th className="pb-4 font-bold">Alamat Pemasangan</th>
            <th className="pb-4 font-bold">Status</th>
            <th className="pb-4 font-bold">Dibuat Tanggal</th>
            <th className="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
            >
              <td className="py-4 font-bold text-slate-100">{lead.id}</td>
              <td className="py-4 font-bold text-slate-200">{lead.name}</td>
              <td className="py-4">
                <span className="text-slate-300 block font-medium">{lead.email}</span>
                <span className="text-slate-500 text-[11px] font-semibold">{lead.phone}</span>
              </td>
              <td className="py-4 text-slate-400 font-medium truncate max-w-[200px]">{lead.address}</td>
              <td className="py-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                  getStatusColor(lead.status)
                }`}>
                  {lead.status}
                </span>
              </td>
              <td className="py-4 text-slate-450 font-medium">{lead.createdAt}</td>
              <td className="py-4 text-right">
                <button
                  onClick={() => onSelectLead(lead)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg transition"
                >
                  Detail Pelanggan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
