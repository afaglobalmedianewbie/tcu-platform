'use client';
import { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, Mail, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PelangganPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tcu_token');
      const res = await fetch('/api/admin/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        throw new Error('Fallback');
      }
    } catch (error) {
      // Mock data
      setCustomers(Array.from({ length: 10 }).map((_, i) => ({
        id: 1000 + i,
        name: `Customer ${i + 1}`,
        email: `cust${i+1}@example.com`,
        phone: `0812345678${i}`,
        package: 'Pro 50Mbps',
        status: i % 4 === 0 ? 'ISOLIR' : i % 5 === 0 ? 'INSTALASI' : i % 7 === 0 ? 'PENDING' : 'AKTIF',
        date: '2023-10-15'
      })));
    }
    setLoading(false);
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === customers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(customers.map(c => c.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AKTIF': return 'bg-emerald-500/20 text-emerald-400';
      case 'ISOLIR': return 'bg-red-500/20 text-red-400';
      case 'INSTALASI': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 text-white bg-[#0b1120] min-h-screen relative pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black font-outfit">Manajemen Pelanggan</h1>
        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors w-full sm:w-auto justify-center">
          <Plus size={18} />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama, email, ID..." 
            className="w-full h-[44px] bg-[#1e293b]/60 border border-[#334155] rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-500 text-white"
          />
        </div>
        <select className="w-full sm:w-[160px] h-[44px] bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 text-white appearance-none">
          <option value="">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="ISOLIR">Isolir</option>
          <option value="INSTALASI">Instalasi</option>
        </select>
        <button className="h-[44px] px-4 bg-[#1e293b]/60 border border-[#334155] rounded-xl flex items-center justify-center hover:bg-[#334155]/50 transition-colors sm:hidden">
          <Search size={18} />
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total', value: '1,250' },
          { label: 'Aktif', value: '1,180', color: 'text-emerald-400' },
          { label: 'Isolir', value: '45', color: 'text-red-400' },
          { label: 'Baru Bulan Ini', value: '25', color: 'text-violet-400' },
        ].map((stat, i) => (
          <div key={i} className="flex-1 min-w-[140px] bg-[#1e293b]/60 border border-[#334155] rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">{stat.label}</p>
            <p className={`text-xl font-black font-outfit ${stat.color || 'text-white'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium w-10">
                  <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === customers.length} onChange={toggleSelectAll} className="rounded border-slate-600 bg-slate-800" />
                </th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nama & Email</th>
                <th className="px-4 py-3 font-medium">No.HP</th>
                <th className="px-4 py-3 font-medium">Paket</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-sm">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/pelanggan/${c.id}`)}>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded border-slate-600 bg-slate-800" />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-300">#{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-300">{c.package}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.date}</td>
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-medium bg-[#334155]/50 hover:bg-[#334155] px-3 py-1.5 rounded-md transition-colors">
                        Detail
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#334155]/50 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-[#334155]/50 flex items-center justify-between text-sm text-slate-400">
          <span>Menampilkan 1-10 dari 1,250</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded bg-violet-600 text-white">1</button>
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80">2</button>
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80">3</button>
            <button className="px-3 py-1 rounded bg-[#334155]/30 hover:bg-[#334155]/80">Next</button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-[#334155] shadow-2xl shadow-black/50 rounded-2xl px-6 py-4 flex items-center gap-6 animate-in slide-in-from-bottom-10 z-50">
          <div className="font-bold font-outfit text-white">
            <span className="text-violet-400">{selectedIds.size}</span> terpilih
          </div>
          <div className="h-6 w-px bg-[#334155]"></div>
          <div className="flex gap-2 sm:gap-3">
            <button className="flex items-center gap-2 text-sm font-medium hover:text-white text-slate-300 transition-colors">
              <Mail size={16} /> <span className="hidden sm:inline">Kirim Email</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium hover:text-white text-slate-300 transition-colors">
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={16} /> <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
