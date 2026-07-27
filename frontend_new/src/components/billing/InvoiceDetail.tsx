'use client';
import React from 'react';
import { Invoice } from '../../types/billing';
import { useConfirmManualPayment } from '../../hooks/useBilling';

interface InvoiceDetailProps {
  invoice: Invoice | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function InvoiceDetail({
  invoice,
  onClose,
  isAdmin = false
}: InvoiceDetailProps) {
  const mutation = useConfirmManualPayment();

  if (!invoice) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleManualConfirm = () => {
    mutation.mutate(
      { id: invoice.id, paymentMethod: 'Manual Transfer (Admin)' },
      {
        onSuccess: () => {
          alert(`Pembayaran untuk ${invoice.id} berhasil dikonfirmasi secara manual.`);
          onClose();
        }
      }
    );
  };

  const isUnpaid = invoice.status === 'UNPAID';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Detail Invoice</span>
            <h3 className="text-xl font-black text-slate-100 mt-1">{invoice.id}</h3>
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
              <span className="text-slate-500 block mb-0.5">Nama Pelanggan</span>
              <span className="text-slate-200 font-bold">{invoice.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Paket Layanan</span>
              <span className="text-slate-200 font-semibold">{invoice.planName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">Jumlah Tagihan</span>
              <span className="text-[#7B4DFF] font-black text-lg">{formatRupiah(invoice.amount)}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Periode Penagihan</span>
              <span className="text-slate-200 font-semibold">{invoice.billingPeriod}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block mb-0.5">Tanggal Jatuh Tempo</span>
              <span className="text-slate-200 font-semibold">{invoice.dueDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Status Pembayaran</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase mt-1 ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {invoice.paidAt && (
            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-slate-500 block mb-0.5">Dibayar Tanggal</span>
                <span className="text-slate-200 font-semibold">{invoice.paidAt}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Metode Pembayaran</span>
                <span className="text-slate-200 font-semibold">{invoice.paymentMethod}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Tutup
          </button>
          {isAdmin && isUnpaid && (
            <button
              onClick={handleManualConfirm}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              Konfirmasi Lunas (Manual)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
