'use client';
import React from 'react';
import { Invoice } from '../../types/billing';

interface InvoiceTableProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  isAdmin?: boolean;
}

export default function InvoiceTable({
  invoices,
  onSelectInvoice,
  isAdmin = false
}: InvoiceTableProps) {
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'UNPAID':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'EXPIRED':
        return 'bg-slate-800 text-slate-400 border border-slate-700';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-xs font-semibold text-slate-500">
            <th className="pb-4 font-bold">No. Invoice</th>
            {isAdmin && <th className="pb-4 font-bold">Nama Pelanggan</th>}
            <th className="pb-4 font-bold">Paket Layanan</th>
            <th className="pb-4 font-bold">Jumlah</th>
            <th className="pb-4 font-bold">Status</th>
            <th className="pb-4 font-bold">Jatuh Tempo</th>
            <th className="pb-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="border-b border-slate-800/35 text-slate-200 text-xs md:text-sm hover:bg-slate-900/10 transition-colors"
            >
              <td className="py-4 font-bold text-slate-100">{inv.id}</td>
              {isAdmin && <td className="py-4 font-bold text-slate-300">{inv.customerName}</td>}
              <td className="py-4 text-slate-400 font-medium">{inv.planName}</td>
              <td className="py-4 font-bold text-[#7B4DFF]">{formatRupiah(inv.amount)}</td>
              <td className="py-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                  getStatusBadge(inv.status)
                }`}>
                  {inv.status}
                </span>
              </td>
              <td className="py-4 text-slate-450 font-medium">{inv.dueDate}</td>
              <td className="py-4 text-right">
                <button
                  onClick={() => onSelectInvoice(inv)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg transition"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
