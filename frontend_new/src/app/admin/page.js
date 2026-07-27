'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Plus, 
  Wrench, 
  FileText, 
  Globe, 
  Send, 
  Cpu, 
  HardDrive, 
  Terminal, 
  ChevronRight,
  Database,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

// ─── Mini Chart (Sparkline) ─────────────────────────────────────────────────
function Sparkline({ data, color = '#3b82f6', height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KPICard({ title, value, sub, color, icon: IconComponent, spark, trend }) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-950/5',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-950/5',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-950/5',
    red: 'text-red-400 bg-red-500/10 border-red-500/20 shadow-red-950/5',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-950/5',
  };
  const colorHex = {
    emerald: '#10b981',
    blue: '#2563eb',
    amber: '#f59e0b',
    red: '#ef4444',
    purple: '#a855f7',
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-black text-slate-100 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-xs text-slate-500 font-medium">{sub}</div>
      {spark && (
        <div className="mt-3">
          <Sparkline data={spark} color={colorHex[color] || '#2563eb'} height={32} />
        </div>
      )}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    ACTIVE:       { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Aktif' },
    ISOLATED:     { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Isolir' },
    INSTALLATION: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Instalasi' },
    OPEN:         { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Open' },
    IN_PROGRESS:  { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Proses' },
    CLOSED:       { bg: 'bg-slate-700/30 text-slate-400 border-slate-700/50', label: 'Selesai' },
    UNPAID:       { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Belum Bayar' },
    PAID:         { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Lunas' },
    HIGH:         { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'HIGH' },
    MEDIUM:       { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'MEDIUM' },
    LOW:          { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'LOW' },
  };
  const s = map[status] || { bg: 'bg-slate-750 text-slate-400 border-slate-700', label: status || '-' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.bg}`}>
      {s.label}
    </span>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────
function DataTable({ title, cols, rows, action }) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden shadow-lg shadow-black/10">
      <div className="px-5 py-4 flex justify-between items-center border-b border-[#334155]">
        <h3 className="font-bold text-sm text-slate-200">{title}</h3>
        {action && (
          <Link href={action.href} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
            {action.label} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#334155]/60 bg-slate-900/10">
              {cols.map(c => (
                <th key={c} className="px-5 py-3 text-[10px] font-bold text-slate-450 uppercase tracking-widest">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/40">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={`px-5 py-3.5 text-xs ${j === 0 ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ icon: IconComponent, label, desc, color, href }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-550/20 group-hover:bg-blue-500 group-hover:text-white',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-550/20 group-hover:bg-purple-500 group-hover:text-white',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-550/20 group-hover:bg-emerald-500 group-hover:text-white',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-550/20 group-hover:bg-amber-500 group-hover:text-slate-950',
    red: 'bg-red-500/10 text-red-400 border-red-550/20 group-hover:bg-red-500 group-hover:text-white',
  };

  return (
    <Link href={href} className="group flex items-center gap-4.5 p-4 bg-slate-800/40 border border-[#334155] rounded-2xl hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${colorMap[color] || colorMap.blue}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-200 leading-tight group-hover:text-blue-400 transition-colors">{label}</div>
        <div className="text-[10px] text-slate-500 mt-1 truncate">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

// ─── ProgressBarMetric ────────────────────────────────────────────────────────
function ProgressBarMetric({ label, percent, value, color }) {
  const colorClass = {
    blue: 'bg-blue-500 shadow-blue-500/20',
    emerald: 'bg-emerald-500 shadow-emerald-500/20',
    amber: 'bg-amber-500 shadow-amber-500/20',
    red: 'bg-red-500 shadow-red-500/20',
  };
  const parsedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-250">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div 
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${colorClass[color] || colorClass.blue}`}
          style={{ width: `${parsedPercent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let offset = 0;
  const r = 60, cx = 70, cy = 70, stroke = 12;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32 md:w-36 md:h-36">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={stroke} />
      {data.map((d, i) => {
        const pct = d.value / total;
        const seg = pct * circ;
        const strokeDasharray = `${seg} ${circ - seg}`;
        const strokeDashoffset = -offset;
        offset += seg;
        return (
          <circle 
            key={i} 
            cx={cx} 
            cy={cy} 
            r={r} 
            fill="none" 
            stroke={d.color} 
            strokeWidth={stroke}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        );
      })}
    </svg>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [sysStats, setSysStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  
  const locale = lang === 'id' ? 'id-ID' : 'en-US';

  useEffect(() => {
    // Check local authentication token
    const token = localStorage.getItem('tcu_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load System Stats
    const fetchStats = () => {
      fetch('/api/system/stats', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) setSysStats(data.stats);
        })
        .catch(err => console.error('Error fetching system stats:', err));
    };

    // Load Activity Logs
    const fetchLogs = () => {
      fetch('/api/audit/logs?limit=4', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) setActivityLogs(data.logs);
        })
        .catch(err => console.error('Error fetching activity logs:', err));
    };

    fetchStats();
    fetchLogs();

    const interval = setInterval(fetchStats, 5000); // Poll server stats every 5s
    return () => clearInterval(interval);
  }, [router]);

  // Mock KPI charts
  const revenueHistory = [185, 192, 189, 197, 204, 215, 235, 230];
  const userHistory = [1200, 1220, 1250, 1265, 1290, 1310, 1335, 1358];
  const ticketHistory = [8, 12, 15, 9, 6, 11, 7, 5];

  // Ticket distribution data
  const ticketDist = [
    { label: 'PPPoE', value: 12, color: '#3b82f6' },
    { label: 'Hotspot', value: 8, color: '#a855f7' },
    { label: 'Hardware', value: 5, color: '#ef4444' },
    { label: 'Jaringan', value: 15, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <span>👋</span> {lang === 'id' ? 'Selamat Datang, Administrator' : 'Welcome back, Administrator'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'id' ? 'Berikut adalah rangkuman performa operasional & server hari ini.' : 'Here is the summary of operational & server performance today.'}
          </p>
        </div>
        <div className="text-[10px] md:text-xs text-slate-450 bg-slate-900/60 border border-[#334155] rounded-xl px-4 py-2 font-semibold">
          Last updated: {new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ─── KPI Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard
          title="Pendapatan Bulanan"
          value="Rp 235,4M"
          sub="+Rp 21,4M dari bulan lalu"
          color="emerald"
          icon={TrendingUp}
          spark={revenueHistory}
          trend={12.4}
        />
        <KPICard
          title="Total Pelanggan"
          value="1.358"
          sub="+48 Pelanggan baru minggu ini"
          color="blue"
          icon={Users}
          spark={userHistory}
          trend={4.5}
        />
        <KPICard
          title="Tiket Gangguan"
          value="5 Aktif"
          sub="3 Tiket kritis butuh penanganan"
          color="amber"
          icon={AlertCircle}
          spark={ticketHistory}
          trend={-25.0}
        />
        <KPICard
          title="Mikrotik Router"
          value="4 / 4 Online"
          sub="Radius Server tersambung penuh"
          color="purple"
          icon={Globe}
        />
      </div>

      {/* ─── Row 2: Charts & Data Tables ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Ticket Distribution Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg shadow-black/10 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-200">Kategori Tiket Aktif</h3>
            <span className="text-[10px] bg-slate-900/60 text-slate-400 border border-slate-800 rounded px-2 py-0.5 font-bold">Live Data</span>
          </div>
          <div className="flex items-center justify-around gap-4 py-3">
            <DonutChart data={ticketDist} />
            <div className="space-y-2 flex-1 max-w-[140px]">
              {ticketDist.map(d => (
                <div key={d.label} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: d.color }} />
                    <span>{d.label}</span>
                  </div>
                  <span className="font-bold text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Active Clients Table */}
        <div className="xl:col-span-2">
          <DataTable
            title="Pelanggan Baru Terdaftar"
            cols={['Nama Pelanggan', 'Paket Internet', 'Status', 'Metode Bayar']}
            rows={[
              ['Mochammad Syafei', 'Home Premium - 50 Mbps', <Badge status="ACTIVE" />, 'Otomatis (Midtrans)'],
              ['Heryanto Pangandaran', 'Home Lite - 30 Mbps', <Badge status="INSTALLATION" />, 'Manual Transfer'],
              ['Indah Lestari Ciamis', 'Business Pro - 100 Mbps', <Badge status="ACTIVE" />, 'Otomatis (Midtrans)'],
              ['Rian Hidayat Banjar', 'Home Premium - 50 Mbps', <Badge status="ISOLATED" />, 'Belum Memilih'],
            ]}
            action={{ href: '/admin/pelanggan', label: t('see_all') }}
          />
        </div>

      </div>

      {/* ─── Row 3: Quick Actions + Activity Log + Server Monitor ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-200">{t('quick_actions_admin')}</h3>
          <div className="grid grid-cols-1 gap-3.5">
            <QuickAction 
              icon={Plus} 
              label={t('add_customer')}
              desc={lang === 'id' ? 'Daftarkan pelanggan baru langsung ke Radius & DB' : 'Register new customer to Radius & Database'}
              color="blue" 
              href="/admin/pelanggan/add" 
            />
            <QuickAction 
              icon={Wrench} 
              label={lang === 'id' ? 'Buat Work Order' : 'Create Work Order'}
              desc={lang === 'id' ? 'Tugaskan & jadwalkan teknisi lapangan' : 'Assign & schedule field technicians'}
              color="purple" 
              href="/admin/teknisi" 
            />
            <QuickAction 
              icon={FileText} 
              label={lang === 'id' ? 'Tagihan Billing' : 'Billing Invoices'}
              desc={lang === 'id' ? 'Kelola tagihan massal bulanan midtrans' : 'Manage mass monthly billing via midtrans'}
              color="emerald" 
              href="/admin/billing" 
            />
            <QuickAction 
              icon={Globe} 
              label={lang === 'id' ? 'RADIUS & MikroTik' : 'RADIUS & MikroTik'}
              desc={lang === 'id' ? 'Cek koneksi PPPoE & pemantauan jaringan' : 'Check PPPoE connections & network monitoring'}
              color="amber" 
              href="/admin/radius" 
            />
            <QuickAction 
              icon={Send} 
              label={lang === 'id' ? 'Broadcast Pesan' : 'Broadcast Message'}
              desc={lang === 'id' ? 'Kirim Whatsapp/Email massal ke pelanggan' : 'Send WhatsApp/Email blasts to clients'}
              color="red" 
              href="/admin/mail/mass" 
            />
          </div>
        </div>

        {/* System & Server Audit logs */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg shadow-black/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-sm text-slate-255">{t('system_log')}</h3>
              <Link href="/admin/audit" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                {t('see_all')} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {activityLogs.length > 0 ? activityLogs.map((log, i) => {
                const isDanger = log.method === 'DELETE' || (log.action || '').toLowerCase().includes('fail') || (log.action || '').toLowerCase().includes('gagal');
                return (
                  <div key={log.id || i} className="flex gap-3.5 items-start border-b border-[#334155]/40 pb-3 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${
                      isDanger ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {isDanger ? <AlertCircle className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                        <span className="text-slate-100 font-bold">{log.user?.email || 'System'}</span>: {log.action}
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {new Date(log.created_at).toLocaleTimeString(locale)} · IP: {log.ip_address}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-slate-500 text-xs font-medium">
                  {lang === 'id' ? 'Belum ada log aktivitas hari ini.' : 'No activity logs today.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Server Stats Monitor */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 shadow-lg shadow-black/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-sm text-slate-200">{t('live_server_stats')}</h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('online')}
              </span>
            </div>

            {sysStats ? (
              <div className="space-y-4">
                <ProgressBarMetric
                  label={lang === 'id' ? 'Beban CPU' : 'CPU Load'}
                  percent={sysStats.cpuPercent}
                  value={`${sysStats.cpuPercent}%`}
                  color={sysStats.cpuPercent > 80 ? 'red' : sysStats.cpuPercent > 50 ? 'amber' : 'blue'}
                />
                <ProgressBarMetric
                  label={lang === 'id' ? 'Memori RAM' : 'RAM Memory'}
                  percent={sysStats.ramPercent}
                  value={`${sysStats.ramUsedGb} / ${sysStats.ramTotalGb} GB`}
                  color={sysStats.ramPercent > 90 ? 'red' : sysStats.ramPercent > 70 ? 'amber' : 'emerald'}
                />
                <ProgressBarMetric
                  label={lang === 'id' ? 'Penyimpanan Disk (/)' : 'Disk Storage (/)'}
                  percent={sysStats.disk.percent}
                  value={`${sysStats.disk.used} / ${sysStats.disk.total}`}
                  color={sysStats.disk.percent > 85 ? 'red' : 'emerald'}
                />

                <div className="border-t border-[#334155] pt-4 mt-5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">{t('docker_status')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(sysStats.containers || []).map(c => (
                      <div 
                        key={c.name} 
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-[#334155] text-[10px]"
                      >
                        <span className="text-slate-300 font-semibold truncate max-w-[80px]">{c.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          c.status.includes('Up') ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold">{t('server_connecting') || 'Menghubungkan ke pemantau VPS...'}</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
}
