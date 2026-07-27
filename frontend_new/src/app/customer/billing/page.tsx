'use client';

import React, { useState } from 'react';
import { useInvoices } from '../../../hooks/useBilling';
import { Invoice } from '../../../types/billing';
import InvoiceTable from '../../../components/billing/InvoiceTable';
import InvoiceDetail from '../../../components/billing/InvoiceDetail';

export default function CustomerBillingPage() {
  // Pull active customer invoices (Mocked under CST-001)
  const { data: invoices = [], isLoading } = useInvoices('CST-001');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="mb-8 md:mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span className="text-[#7B4DFF]">💳</span> Riwayat Tagihan Anda
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Periksa status tagihan aktif berjalan dan riwayat pembayaran bulanan Anda.
            </p>
          </div>
        </header>

        {/* Invoice List Panel */}
        <section className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <h2 className="text-base md:text-lg font-bold text-slate-200 mb-6">
            Daftar Tagihan Rekening
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-950/20 border border-slate-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              isAdmin={false}
            />
          )}
        </section>

        {/* Invoice Detail Dialog Overlay */}
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          isAdmin={false}
        />
      </div>
    </div>
  );
}
