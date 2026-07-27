'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, AlertCircle, AlertTriangle, Plus, FileText, Wrench, RefreshCw, Activity, Server, Shield, Database, Globe, Cpu, Radio, Zap, HardDrive, Bot, Layers } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Auth Guard
    const token = localStorage.getItem('tcu_token');
    const userStr = localStorage.getItem('tcu_user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) {
        router.push('/');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tcu_token');
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      // Fallback mock data
      setData({
        kpis: {
          revenue: 'Rp 45.2M',
          customers: 1250,
          openTickets: 12,
          activeIncidents: 3
        },
        revenueData: [
          { month: 'Jan', value: 30 }, { month: 'Feb', value: 40 }, { month: 'Mar', value: 35 },
          { month: 'Apr', value: 50 }, { month: 'May', value: 49 }, { month: 'Jun', value: 60 },
          { month: 'Jul', value: 70 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 100 },
          { month: 'Oct', value: 120 }, { month: 'Nov', value: 150 }, { month: 'Dec', value: 200 }
        ],
        recentActivity: [
          { id: 1, time: '10:05', type: 'Payment', desc: 'INV-1002 Lunas', status: 'SUCCESS' },
          { id: 2, time: '09:30', type: 'Ticket', desc: 'TKT-049 Resolved', status: 'RESOLVED' },
          { id: 3, time: '09:15', type: 'System', desc: 'Auto Backup', status: 'INFO' },
          { id: 4, time: '08:00', type: 'Provision', desc: 'New OLT Added', status: 'WARNING' },
          { id: 5, time: '07:45', type: 'Customer', desc: 'Budi Santoso Registered', status: 'SUCCESS' },
        ],
        services: [
          { name: 'Backend API', status: 'up' },
          { name: 'Database', status: 'up' },
          { name: 'Radius Auth', status: 'up' },
          { name: 'OLT 1 (Core)', status: 'up' },
          { name: 'OLT 2 (Dist)', status: 'down' }
        ]
      });
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading && !data) {
    return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  }

  const maxRev = Math.max(...(data.revenueData.map((d: any) => d.value) || [1]));

  return (
    <div className="p-4 lg:p-8 space-y-6 text-white bg-[#0b1120] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-outfit">Dashboard Admin</h1>
          <p className="text-sm text-slate-400 font-inter mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#1e293b]/60 hover:bg-[#334155]/80 px-4 py-2 rounded-lg border border-[#334155] transition-colors"
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Total Revenue MTD</p>
              <h3 className="text-3xl font-black font-outfit">{data.kpis.revenue}</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
          </div>
          <span className="text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">+12% vs last month</span>
        </div>

        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Pelanggan Aktif</p>
              <h3 className="text-3xl font-black font-outfit">{data.kpis.customers}</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <span className="text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400">+5 new today</span>
        </div>

        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Tiket Open</p>
              <h3 className="text-3xl font-black font-outfit">{data.kpis.openTickets}</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <AlertCircle size={20} />
            </div>
          </div>
          <span className="text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">-2 since yesterday</span>
        </div>

        <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 lg:p-6 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Gangguan Aktif</p>
              <h3 className="text-3xl font-black font-outfit">{data.kpis.activeIncidents}</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
          </div>
          <span className="text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-400">Needs attention</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/pelanggan" className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-xl bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 border border-violet-500/30 font-medium transition-colors">
          <Plus size={18} />
          <span>Tambah Pelanggan</span>
        </Link>
        <Link href="/admin/billing" className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-medium transition-colors">
          <FileText size={18} />
          <span>Generate Invoice</span>
        </Link>
        <Link href="/admin/teknisi" className="flex items-center justify-center gap-2 h-[44px] px-6 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-medium transition-colors">
          <Wrench size={18} />
          <span>Assign Teknisi</span>
        </Link>
      </div>

      {/* ─── Company-Network Architecture Control Panel & Quick Navigation ─────────────── */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#334155]/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                COMPANY-NETWORK MODULE
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                6 MVP Architecture Active
              </span>
            </div>
            <h2 className="text-xl font-black font-outfit text-white flex items-center gap-2 mt-1">
              <Globe className="w-5 h-5 text-blue-400" /> Navigasi & Kontrol Arsitektur Jaringan (Company-Network)
            </h2>
          </div>
          <Link 
            href="/admin/radius" 
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            Lihat Semua Modul RADIUS & OLT →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Card 1: DAL & Auto Provisioning */}
          <Link 
            href="/admin/olt" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">1-Click Auto</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">1. Multi-Vendor OLT DAL</h4>
              <p className="text-xs text-slate-400 mt-1">ZTE C320 & Huawei MA5608T Driver Abstraction Layer dengan Auto-Provisioning SNMP</p>
            </div>
            <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">Kelola OLT & ONU →</span>
          </Link>

          {/* Card 2: 2D Chassis Visualizer */}
          <Link 
            href="/admin/olt/visualizer" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold">2D Physical</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">2. Visualizer Chassis 2D OLT</h4>
              <p className="text-xs text-slate-400 mt-1">Peta fisik 2D rack ZTE C320 4-Slot & indikator LED port GPON real-time</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">Buka Rack Visualizer →</span>
          </Link>

          {/* Card 3: AI Predictive Signal & OTDR */}
          <Link 
            href="/admin/ai/predictive" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Radio size={20} />
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">OTDR AI</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">3. Predictive & OTDR Estimator</h4>
              <p className="text-xs text-slate-400 mt-1">Deteksi penurunan sinyal (Δ Power) &amp; estimasi KM lokasi kabel putus</p>
            </div>
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">Analisis Sinyal AI →</span>
          </Link>

          {/* Card 4: OLT Config Backup & Disaster Recovery */}
          <Link 
            href="/admin/olt" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform">
                <HardDrive size={20} />
              </div>
              <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 font-bold">Auto Backup</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">4. Automated Config Backup</h4>
              <p className="text-xs text-slate-400 mt-1">Export startup-config `startrun.dat` (394 KB) ke Cloud & 1-Click Restore</p>
            </div>
            <span className="text-[11px] font-bold text-violet-400 flex items-center gap-1">Backup & Restore OLT →</span>
          </Link>

          {/* Card 5: Field Engineer Bot Command Center */}
          <Link 
            href="/admin/radius/acs" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                <Bot size={20} />
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-bold">Chatbot Center</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">5. Field Bot Command Center</h4>
              <p className="text-xs text-slate-400 mt-1">Chatbot WhatsApp/Telegram teknisi: `/cek`, `/register`, `/reboot` instan</p>
            </div>
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">Log Chatbot & ACS →</span>
          </Link>

          {/* Card 6: Enterprise PPP & RADIUS Isolir Engine */}
          <Link 
            href="/admin/radius" 
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/50 transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">650 PPP Sessions</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">6. Router PPP & RADIUS Engine</h4>
              <p className="text-xs text-slate-400 mt-1">Monitoring 650 PPPoE aktif CCR1036, CoA Disconnect, & Billing Isolir Walled Garden</p>
            </div>
            <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">Kelola PPP & Isolir Engine →</span>
          </Link>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-6">
        <h3 className="text-lg font-bold font-outfit mb-6">Revenue 12 Bulan Terakhir</h3>
        <div className="h-[200px] w-full flex items-end justify-between gap-1 sm:gap-2">
          {data.revenueData.map((d: any, i: number) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
              <div 
                className="w-full bg-violet-500/50 hover:bg-violet-400 rounded-t-sm transition-all relative cursor-pointer"
                style={{ height: `${(d.value / maxRev) * 100}%`, minHeight: '4px' }}
                title={`Rp ${d.value}M`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b1120] text-xs px-2 py-1 rounded border border-[#334155] whitespace-nowrap z-10 transition-opacity">
                  Rp {d.value}M
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#334155]">
            <h3 className="text-lg font-bold font-outfit">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Waktu</th>
                  <th className="px-4 py-3 font-medium">Jenis</th>
                  <th className="px-4 py-3 font-medium">Keterangan</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/50 text-sm">
                {data.recentActivity.map((act: any) => (
                  <tr key={act.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{act.time}</td>
                    <td className="px-4 py-3 font-medium">{act.type}</td>
                    <td className="px-4 py-3 text-slate-300">{act.desc}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md ${
                        act.status === 'SUCCESS' || act.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' :
                        act.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Health */}
        <div className="lg:col-span-1 bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-outfit">Service Health</h3>
            <button onClick={handleRefresh} className="text-slate-400 hover:text-white transition-colors">
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {data.services.map((srv: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#0b1120]/50 border border-[#334155]/50">
                <div className="flex items-center gap-3">
                  {srv.name.includes('API') && <Activity size={16} className="text-slate-400" />}
                  {srv.name.includes('Database') && <Database size={16} className="text-slate-400" />}
                  {srv.name.includes('Auth') && <Shield size={16} className="text-slate-400" />}
                  {srv.name.includes('OLT') && <Server size={16} className="text-slate-400" />}
                  <span className="text-sm font-medium">{srv.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[0.7rem] font-bold uppercase ${srv.status === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {srv.status === 'up' ? 'ONLINE' : 'OFFLINE'}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${srv.status === 'up' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
