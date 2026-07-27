'use client';
import React from 'react';

interface InvoiceCardProps {
  invoice: {
    invoiceId: string;
    amount: number;
    dueDate: string;
    status: 'UNPAID' | 'PAID';
  } | null;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  if (!invoice) {
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col justify-center h-full">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Tagihan Aktif
        </h4>
        <p className="text-sm font-semibold text-slate-400">
          Tidak ada tagihan aktif berjalan. Layanan Anda lunas!
        </p>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isUnpaid = invoice.status === 'UNPAID';

  return (
    <div className={`p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ${
      isUnpaid ? 'border-rose-500/30' : 'border-slate-800'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tagihan Berjalan
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-wider ${
            isUnpaid ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            {invoice.status}
          </span>
        </div>
        <div className="text-2xl font-black text-slate-100 tracking-tight">
          {formatRupiah(invoice.amount)}
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          ID Tagihan: <span className="text-slate-300 font-semibold">{invoice.invoiceId}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Jatuh Tempo: <span className="text-slate-300 font-semibold">{invoice.dueDate}</span>
        </p>
      </div>

      {isUnpaid && (
        <button
          onClick={() => alert('Mengalihkan ke pembayaran Xenplatform Xendit...')}
          className="mt-6 w-full py-2.5 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7B4DFF]/15 transition duration-150"
        >
          Bayar Sekarang
        </button>
      )}
    </div>
  );
}
