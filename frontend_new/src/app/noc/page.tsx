'use client';
import { useEffect, useState } from 'react';
import { Activity, Server, Wifi, RefreshCw, AlertTriangle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NocDashboard() {
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Auth Check
    const userStr = localStorage.getItem('tcu_user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (!['ADMIN', 'SUPERADMIN', 'OPERATOR', 'TEKNISI'].includes(user.role)) {
        router.push('/');
      }
    } catch (e) {
      router.push('/login');
    }

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const olts = [
    { name: 'OLT-CORE-1', ip: '10.0.0.1', ports: '8/8', status: 'ONLINE', rx: '-18.5 dBm', uptime: '45d 12h' },
    { name: 'OLT-DIST-A', ip: '10.0.1.5', ports: '12/16', status: 'ONLINE', rx: '-21.2 dBm', uptime: '12d 5h' },
    { name: 'OLT-DIST-B', ip: '10.0.1.6', ports: '4/8', status: 'WARNING', rx: '-26.8 dBm', uptime: '1d 2h' },
  ];

  const sessions = [
    { user: 'cust_001', ip: '100.64.0.12', down: '45.2', up: '12.1', duration: '2d 4h' },
    { user: 'cust_089', ip: '100.64.1.55', down: '12.5', up: '2.4', duration: '0d 12h' },
    { user: 'cust_112', ip: '100.64.2.11', down: '98.0', up: '45.5', duration: '5d 1h' },
    { user: 'cust_204', ip: '100.64.0.88', down: '0.5', up: '0.1', duration: '12d 0h' },
  ];

  const alerts = [
    { id: 1, type: 'CRITICAL', msg: 'High packet loss on OLT-DIST-B uplink', time: '2 mins ago' },
    { id: 2, type: 'WARNING', msg: 'Low RX optical power on Port 3/PON1', time: '15 mins ago' },
    { id: 3, type: 'INFO', msg: 'Radius Auth DB synchronized', time: '1 hour ago' },
  ];

  return (
    <div className="h-[calc(100vh-var(--navbar-h,64px))] overflow-auto bg-[#0b1120] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#0b1120]/95 backdrop-blur border-b border-[#334155] px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black font-outfit">NOC Dashboard</h1>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400 hidden sm:inline">Last update: {lastUpdate.toLocaleTimeString()}</span>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#1e293b]/80 hover:bg-[#334155] px-3 py-1.5 rounded-lg border border-[#334155] transition-colors"
          >
            <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 flex-1">
        {/* Status Bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium bg-[#1e293b]/40 rounded-lg p-3 border border-[#334155]/50">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Core Network</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>RADIUS Auth</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>OLT Uplinks</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Billing Sync</div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">Active Sessions</p>
              <div className="flex items-baseline gap-1"><span className="text-2xl font-black font-outfit text-blue-400">1,248</span></div>
            </div>
            <Activity className="text-blue-500/50" size={32} />
          </div>
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">OLT Online</p>
              <div className="flex items-baseline gap-1"><span className="text-2xl font-black font-outfit text-emerald-400">3/3</span></div>
            </div>
            <Server className="text-emerald-500/50" size={32} />
          </div>
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">Avg Latency</p>
              <div className="flex items-baseline gap-1"><span className="text-2xl font-black font-outfit text-amber-400">24</span><span className="text-xs text-slate-400">ms</span></div>
            </div>
            <Wifi className="text-amber-500/50" size={32} />
          </div>
          <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] sm:text-xs uppercase text-slate-400 font-bold mb-1">Packet Loss</p>
              <div className="flex items-baseline gap-1"><span className="text-2xl font-black font-outfit text-red-400">0.2</span><span className="text-xs text-slate-400">%</span></div>
            </div>
            <AlertTriangle className="text-red-500/50" size={32} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* OLT Table */}
            <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#334155] bg-[#0b1120]/30">
                <h3 className="font-bold font-outfit flex items-center gap-2"><Server size={16} /> OLT Status</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium">Name / IP</th>
                      <th className="px-4 py-3 font-medium">Ports</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Avg RX</th>
                      <th className="px-4 py-3 font-medium text-right">Uptime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/50">
                    {olts.map((olt, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <div className="text-white">{olt.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{olt.ip}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{olt.ports}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[0.7rem] font-bold uppercase px-2 py-0.5 rounded-md ${olt.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {olt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{olt.rx}</td>
                        <td className="px-4 py-3 text-right text-slate-400 text-xs">{olt.uptime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#334155] bg-[#0b1120]/30">
                <h3 className="font-bold font-outfit flex items-center gap-2"><Activity size={16} /> Top Active Sessions (Bandwidth)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#0b1120]/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium">User / IP</th>
                      <th className="px-4 py-3 font-medium text-blue-400">↓ Down (Mbps)</th>
                      <th className="px-4 py-3 font-medium text-emerald-400">↑ Up (Mbps)</th>
                      <th className="px-4 py-3 font-medium text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/50 font-mono">
                    {sessions.map((ses, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-sans font-medium text-white">{ses.user}</div>
                          <div className="text-xs text-slate-400">{ses.ip}</div>
                        </td>
                        <td className="px-4 py-3 text-blue-400">{ses.down}</td>
                        <td className="px-4 py-3 text-emerald-400">{ses.up}</td>
                        <td className="px-4 py-3 text-right text-slate-400 text-xs font-sans">{ses.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1 bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl flex flex-col max-h-[500px]">
            <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0b1120]/30">
              <h3 className="font-bold font-outfit flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Active Alerts</h3>
              <span className="bg-red-500 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">{alerts.length}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-hide">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg border border-[#334155]/50 bg-[#0b1120]/50 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className={`text-[0.65rem] font-bold uppercase px-1.5 py-0.5 rounded ${
                      alert.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                      alert.type === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[0.65rem] text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 leading-snug">{alert.msg}</p>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10 opacity-50">
                  <CheckCircle2 size={32} className="mb-2" />
                  <p className="text-sm">No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
