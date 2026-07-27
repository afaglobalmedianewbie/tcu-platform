'use client';
import { useState } from 'react';
import { FileText, Download, Eye, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('Semua');

  const invoices = Array.from({ length: 8 }).map((_, i) => ({
    id: `INV-202310-${1000 + i}`,
    customer: `Pelanggan ${i + 1}`,
    period: 'Okt 2023',
    amount: 'Rp 250.000',
    status: i % 3 === 0 ? 'LUNAS' : i % 4 === 0 ? 'JATUH_TEMPO' : 'BELUM_BAYAR'
  }));

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'LUNAS': return 'bg-emerald-500/20 text-emerald-400';
      case 'BELUM_BAYAR': return 'bg-red-500/20 text-red-400';
      case 'JATUH_TEMPO': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 text-white bg-[#0b1120] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black font-outfit">Finance & Tagihan</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors w-full sm:w-auto justify-center">
          <FileText size={18} />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6">
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Total Revenue MTD</p>
          <h3 className="text-3xl font-black font-outfit">Rp 45.2M</h3>
        </div>
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6">
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Collectibility Rate</p>
          <h3 className="text-3xl font-black font-outfit text-emerald-400">92.5%</h3>
        </div>
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6">
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Overdue Count</p>
          <h3 className="text-3xl font-black font-outfit text-amber-400">12</h3>
        </div>
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6">
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Lunas Count</p>
          <h3 className="text-3xl font-black font-outfit text-blue-400">1,150</h3>
        </div>
      </div>

      {/* Payment Bar */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6">
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold font-outfit">Tingkat Kolektibilitas</h3>
          <span className="text-2xl font-black text-emerald-400">92.5%</span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 w-[92.5%] transition-all"></div>
          <div className="h-full bg-red-500 w-[7.5%] transition-all"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lunas (Rp 45.2M)</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Belum/Telat (Rp 3.5M)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Semua', 'Belum Bayar', 'Lunas', 'Jatuh Tempo'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-violet-600 text-white' : 'bg-[#1e293b]/60 border border-[#334155] text-slate-300 hover:bg-[#334155]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoice Content */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="block lg:hidden divide-y divide-[#334155]/50">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white">{inv.customer}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{inv.id}</div>
                </div>
                <span className={`text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusStyle(inv.status)}`}>
                  {inv.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{inv.period}</span>
                <span className="font-bold">{inv.amount}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[#334155]/30">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#334155]/50 hover:bg-[#334155] text-sm transition-colors">
                  <Eye size={16} /> Lihat
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#334155]/50 hover:bg-[#334155] text-sm transition-colors">
                  <Download size={16} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Periode</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-300">{inv.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{inv.customer}</td>
                  <td className="px-4 py-3 text-slate-400">{inv.period}</td>
                  <td className="px-4 py-3 font-bold">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusStyle(inv.status)}`}>
                      {inv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#334155] transition-colors" title="Lihat">
                        <Eye size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#334155] transition-colors" title="Download PDF">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#334155]/50 flex items-center justify-between text-sm text-slate-400 bg-[#0b1120]/20">
          <span>Menampilkan 1-8 dari 250</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-violet-600 text-white">1</button>
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80">2</button>
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
