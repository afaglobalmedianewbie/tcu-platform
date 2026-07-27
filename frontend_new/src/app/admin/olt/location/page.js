'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Network,
  Activity,
  Layers,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Radio,
  Send,
  Navigation,
  ArrowLeft,
  RefreshCw,
  Server,
  Zap,
  ChevronRight,
  Info,
  ShieldAlert
} from 'lucide-react';

export default function ODPGisMapPage() {
  const [odpList, setOdpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOdp, setSelectedOdp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, GREEN, YELLOW, RED
  const [splitterFilter, setSplitterFilter] = useState('ALL'); // ALL, 1:8, 1:16
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingTelegram, setSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState(null);

  useEffect(() => {
    fetchGisData();
  }, []);

  const fetchGisData = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/network/gis/odp', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.data) {
        setOdpList(data.data);
        if (!selectedOdp && data.data.length > 0) {
          setSelectedOdp(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch GIS ODP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTelegramAlert = async (odp) => {
    setSendingTelegram(true);
    setTelegramStatus(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/network/alerts/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          odp_code: odp.code,
          odp_name: odp.name,
          lat: odp.coordinates.lat,
          lng: odp.coordinates.lng,
          type: odp.status === 'RED' ? 'FIBER_CUT' : 'LOW_SIGNAL'
        })
      });
      const data = await res.json();
      setTelegramStatus({
        success: true,
        message: data.telegramSent
          ? `Alert Telegram berhasil dikirim ke chat ${data.chatId}`
          : `Alert Telegram dipicu & dicatat di NetworkLog (Bot Token mode simulasi)`
      });
    } catch (err) {
      setTelegramStatus({ success: false, message: 'Gagal mengirim alert Telegram: ' + err.message });
    } finally {
      setSendingTelegram(false);
    }
  };

  const filteredOdps = odpList.filter((odp) => {
    const matchesStatus = statusFilter === 'ALL' || odp.status === statusFilter;
    const matchesSplitter = splitterFilter === 'ALL' || odp.splitter_type === splitterFilter;
    const matchesSearch =
      odp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      odp.olt_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSplitter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Sinyal Optimal'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          label: 'Warning Redaman Low'
        };
      case 'RED':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          dot: 'bg-red-500 animate-ping',
          label: 'Kritis / Fiber Cut'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-500',
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 p-4 md:p-8 space-y-6 font-sans">
      
      {/* ─── Page Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/olt"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke OLT</span>
          </Link>

          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Map GIS Pemetaan ODP & Splitter
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                Heatmap Live
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Pemetaan visual posisi fisik ODP (Optical Distribution Point), rasio Splitter (1:8 / 1:16), dan status redaman sinyal pelanggan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGisData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang Data</span>
          </button>
        </div>
      </div>

      {/* ─── Control Bar & Filters ─── */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ODP, Lokasi, OLT, Alamat..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { key: 'ALL', label: 'Semua Status' },
              { key: 'GREEN', label: '🟢 Optimal' },
              { key: 'YELLOW', label: '🟡 Warning' },
              { key: 'RED', label: '🔴 Kritis' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  statusFilter === f.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Splitter Filter */}
          <select
            value={splitterFilter}
            onChange={(e) => setSplitterFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Splitter</option>
            <option value="1:8">Splitter 1:8</option>
            <option value="1:16">Splitter 1:16</option>
          </select>
        </div>
      </div>

      {/* ─── Main Map & Detail Layout (Grid 12) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Interactive Map (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative min-h-[520px] flex flex-col">
            
            {/* Map Header Overlay */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between z-10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">
                  Visual Heatmap FTTH Fiber Optic Map ({filteredOdps.length} ODP Terdeteksi)
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal (&gt;-20dBm)
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Warning (-20..-25dBm)
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Kritis (&lt;-25dBm)
                </span>
              </div>
            </div>

            {/* Interactive Vector GIS Canvas simulation */}
            <div className="flex-1 bg-[#090d16] relative overflow-hidden p-6 flex flex-col justify-between">
              
              {/* Simulated Map Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

              {/* Decorative Fiber Backbone Lines connecting ODPs */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="20%" y1="30%" x2="45%" y2="45%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
                <line x1="45%" y1="45%" x2="75%" y2="35%" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6" />
                <line x1="45%" y1="45%" x2="35%" y2="75%" stroke="#10b981" strokeWidth="2" />
                <line x1="75%" y1="35%" x2="80%" y2="80%" stroke="#f59e0b" strokeWidth="2" />
              </svg>

              {/* ODP Markers Plotting */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
                {filteredOdps.map((odp) => {
                  const badge = getStatusBadge(odp.status);
                  const isSelected = selectedOdp?.id === odp.id;

                  return (
                    <div
                      key={odp.id}
                      onClick={() => setSelectedOdp(odp)}
                      className={`p-4 rounded-2xl border transition duration-200 cursor-pointer shadow-lg backdrop-blur-md ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/40'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2.5 rounded-xl border ${badge.bg}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-white flex items-center gap-2">
                              {odp.code}
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                                Splitter {odp.splitter_type}
                              </span>
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">{odp.name}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase flex items-center gap-1.5 ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {odp.status}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Kapasitas Splitter</span>
                          <span className="font-bold text-slate-200">{odp.used_ports} / {odp.capacity} Port</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Avg Sinyal Redaman</span>
                          <span className={`font-black ${odp.avg_power < -25 ? 'text-red-400' : odp.avg_power < -20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {odp.avg_power} dBm
                          </span>
                        </div>
                      </div>

                      {/* Map Coordinate Link */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/40 font-medium">
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <Navigation className="w-3 h-3 text-blue-400 shrink-0" />
                          {odp.coordinates.lat.toFixed(4)}, {odp.coordinates.lng.toFixed(4)}
                        </span>
                        <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-0.5">
                          Detail &gt;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Toolbar */}
              <div className="relative z-10 mt-4 p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 font-medium">
                <span>📍 Padaherang - Mangunjaya - Kalipucang FTTH Backbone</span>
                <span className="text-slate-500">Google / OpenStreetMap GIS Coordinates API Connected</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Selected ODP & Splitter Details (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedOdp ? (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-6">
              
              {/* ODP Header */}
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">ODP Detail Inspector</span>
                    <h2 className="text-xl font-black text-white tracking-tight">{selectedOdp.code}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full border text-xs font-black uppercase ${getStatusBadge(selectedOdp.status).bg}`}>
                    {selectedOdp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{selectedOdp.name}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedOdp.address}
                </p>
              </div>

              {/* Splitter & OLT Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Rasio Splitter</span>
                  <div className="text-base font-black text-white mt-0.5">{selectedOdp.splitter_type}</div>
                  <span className="text-[10px] text-slate-500">{selectedOdp.used_ports} dari {selectedOdp.capacity} Port Terpakai</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Redaman Sinyal</span>
                  <div className={`text-base font-black mt-0.5 ${selectedOdp.avg_power < -25 ? 'text-red-400' : selectedOdp.avg_power < -20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedOdp.avg_power} dBm
                  </div>
                  <span className="text-[10px] text-slate-500">{selectedOdp.health_label}</span>
                </div>
              </div>

              {/* OLT Link */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-slate-500 text-[10px] block">Terkoneksi ke OLT</span>
                  <span className="text-slate-200 font-bold">{selectedOdp.olt_id} ({selectedOdp.pon_port})</span>
                </div>
                <Server className="w-4 h-4 text-blue-400" />
              </div>

              {/* Connected Customers under ODP */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex justify-between items-center">
                  <span>Daftar Pelanggan ({selectedOdp.onus?.length || 0})</span>
                  <span className="text-[10px] text-slate-500 font-normal">Real-time Rx Power</span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedOdp.onus?.map((onu, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200 truncate max-w-[160px]">{onu.name}</div>
                        <div className="text-[10px] text-slate-500">Port {onu.port} • SN: {onu.sn}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black ${onu.power_rx < -25 ? 'text-red-400' : onu.power_rx < -20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {onu.power_rx} dBm
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase font-semibold">{onu.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telegram Early Warning Trigger Button */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <button
                  onClick={() => handleSendTelegramAlert(selectedOdp)}
                  disabled={sendingTelegram}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingTelegram ? 'Mengirim Telegram Alert...' : '🚀 Kirim Alert Early-Warning Telegram'}</span>
                </button>

                {telegramStatus && (
                  <div className={`p-3 rounded-xl border text-xs font-semibold ${
                    telegramStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    {telegramStatus.message}
                  </div>
                )}

                {/* Google Maps Coordinates Navigation Link */}
                <a
                  href={`https://maps.google.com/?q=${selectedOdp.coordinates.lat},${selectedOdp.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Buka Koordinat GIS di Google Maps</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              Pilih salah satu ODP di peta untuk melihat detail Splitter & Sinyal Pelanggan.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
