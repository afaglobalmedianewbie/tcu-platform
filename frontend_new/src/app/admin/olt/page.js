'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  User, 
  Search, 
  Plus, 
  Settings, 
  Save, 
  FileText, 
  Cpu, 
  Layers, 
  Wifi, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Sliders, 
  Database, 
  Network,
  Activity,
  Server,
  Radio,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Power,
  Maximize2,
  Eye,
  MoreVertical,
  Zap,
  Filter
} from 'lucide-react';

export default function OLTManagementPage() {
  const [selectedUplink, setSelectedUplink] = useState('');
  const [activeTab, setActiveTab] = useState('onu'); // onu, topology, location, logs
  const [activeSubTab, setActiveSubTab] = useState('olt'); // olt, vpn, logs
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showOnuDetailSlideover, setShowOnuDetailSlideover] = useState(false);
  const [isTopologyAccordionOpen, setIsTopologyAccordionOpen] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data for OLT Table
  const oltDevices = [
    { no: 1, name: 'OLT_PADAHERANG', ip: '172.29.205.62', ro: 'tcuro', rw: 'tcurw', status: 'Online', onus: 284, uptime: '45d 12h' },
    { no: 2, name: 'OLT_MANGUNJAYA', ip: '172.29.72.49', ro: 'tcuro', rw: 'tcurw', status: 'Online', onus: 198, uptime: '12d 08h' },
    { no: 3, name: 'OLT_PADAHERANG02', ip: '172.29.174.54', ro: 'tcuro', rw: 'tcurw', status: 'Online', onus: 245, uptime: '89d 04h' },
    { no: 4, name: 'OLT-KALIPUCANG', ip: '172.29.152.236', ro: 'tcuro', rw: 'tcurw', status: 'Warning', onus: 241, uptime: '02d 19h' },
  ];

  // Mock Data for ONU List
  const onuList = [
    { id: 'gpon-onu_0/1/15', name: 'BENDINELADI_ZIZI-BRZ', status: 'Offline', cause: 'PowerFail', power: '-25.2', olt: 'OLT_PADAHERANG', sn: 'ZTEGC08A9312', vlan: '100', ip: '10.200.15.102' },
    { id: 'gpon-onu_0/1/16', name: 'CUSTOMER_A_NET', status: 'Offline', cause: 'LOS', power: '-31.4', olt: 'OLT_PADAHERANG', sn: 'HWTC8892A110', vlan: '100', ip: '10.200.15.103' },
    { id: 'gpon-onu_0/1/18', name: 'WARUNG_KOPI_BAROKAH', status: 'Online', cause: 'Normal', power: '-18.5', olt: 'OLT_MANGUNJAYA', sn: 'ZTEGC992B104', vlan: '200', ip: '10.200.18.45' },
    { id: 'gpon-onu_0/2/10', name: 'POS_SEKURITI_PERUM', status: 'Online', cause: 'Normal', power: '-11.8', olt: 'OLT_PADAHERANG02', sn: 'ZTEGC771A909', vlan: '100', ip: '10.200.10.88' },
    { id: 'gpon-onu_0/2/14', name: 'TOKO_SEMBAKO_JAYA', status: 'Online', cause: 'Normal', power: '-22.4', olt: 'OLT-KALIPUCANG', sn: 'HWTC6619C001', vlan: '300', ip: '10.200.14.12' },
    { id: 'gpon-onu_0/3/04', name: 'CLINIC_MEDIKA_UTAMA', status: 'Online', cause: 'Normal', power: '-19.2', olt: 'OLT_PADAHERANG', sn: 'ZTEGC118A452', vlan: '100', ip: '10.200.04.50' },
  ];

  const [selectedOnu, setSelectedOnu] = useState(onuList[0]);

  // FEATURE 1: Auto-Discovery & 1-Click Provisioning ONU Unregistered State
  const [unregisteredOnus, setUnregisteredOnus] = useState([
    { id: 'unreg_001', sn: 'ZTEG-C08A9912', vendor: 'ZTE', model: 'F609 v3', olt_id: 'OLT_PADAHERANG', pon_port: '1/1/4', rx_power: -19.4, detected_at: '3m lalu' },
    { id: 'unreg_002', sn: 'HWTC-8891B223', vendor: 'Huawei', model: 'HG8245H', olt_id: 'OLT_MANGUNJAYA', pon_port: '1/1/2', rx_power: -21.8, detected_at: '15m lalu' }
  ]);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [selectedUnregOnu, setSelectedUnregOnu] = useState(null);
  const [provisionForm, setProvisionForm] = useState({
    customer_name: 'Bpk. Ahmad Suherman',
    speed_profile: 'PROFILE_50M',
    vlan: 100,
    pppoe_user: 'ahmad_suherman@tcu.net',
    pppoe_password: 'pass_' + Math.floor(1000 + Math.random() * 9000)
  });
  const [provisionState, setProvisionState] = useState('idle'); // idle, executing, done
  const [provisionConsoleLogs, setProvisionConsoleLogs] = useState([]);

  // FEATURE 2: Telegram Early Warning & Signal Alerts State
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramLogs, setTelegramLogs] = useState(null);

  const handleSimulateTrap = async () => {
    try {
      const res = await fetch('/api/network/olt/simulate-trap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          olt_id: 'OLT_PADAHERANG',
          vendor: 'ZTE',
          model: 'F670L DualBand',
          pon_port: '1/1/5'
        })
      });
      const data = await res.json();
      if (data.data) {
        setUnregisteredOnus((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error('Trap simulation error:', err);
    }
  };

  const handleExecute1ClickProvision = async () => {
    if (!selectedUnregOnu) return;
    setProvisionState('executing');
    setProvisionConsoleLogs([
      `[SNMP TRAP] Validating ONU Serial: ${selectedUnregOnu.sn}...`,
      `[TELNET] Connecting to OLT ${selectedUnregOnu.olt_id}... CONNECTED`,
      `[OLT CLI] Executing: interface gpon-olt_${selectedUnregOnu.pon_port}`,
      `[OLT CLI] Executing: onu 1 type ${selectedUnregOnu.vendor} sn ${selectedUnregOnu.sn}`,
      `[PROFILE] Applying Speed Profile: ${provisionForm.speed_profile}`,
      `[VLAN] Setting Service Port 1 VLAN ${provisionForm.vlan}...`,
      `[TR-069 ACS] Injecting PPPoE Username: ${provisionForm.pppoe_user} to GenieACS...`,
      `[DATABASE] Registering ONU to TCU Database...`
    ]);

    try {
      const res = await fetch('/api/network/olt/provision-onu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sn: selectedUnregOnu.sn,
          olt_id: selectedUnregOnu.olt_id,
          speed_profile: provisionForm.speed_profile,
          vlan: parseInt(provisionForm.vlan, 10),
          pppoe_user: provisionForm.pppoe_user,
          pppoe_password: provisionForm.pppoe_password,
          customer_name: provisionForm.customer_name
        })
      });
      const data = await res.json();

      setTimeout(() => {
        setProvisionState('done');
        setUnregisteredOnus((prev) => prev.filter((item) => item.sn !== selectedUnregOnu.sn));
        setProvisionConsoleLogs((prev) => [
          ...prev,
          `[SUCCESS] 🚀 ONU ${selectedUnregOnu.sn} successfully provisioned & online!`
        ]);
      }, 1500);
    } catch (err) {
      setProvisionState('done');
      setProvisionConsoleLogs((prev) => [...prev, `[ERROR] Gagal provisioning: ${err.message}`]);
    }
  };

  const handleTestTelegramBotAlert = async () => {
    setIsSendingTelegram(true);
    setTelegramLogs(null);
    try {
      const res = await fetch('/api/network/alerts/test-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odp_code: 'ODP-PDH-04',
          odp_name: 'ODP Padaherang RT 02/05',
          lat: -7.6432,
          lng: 108.6512,
          type: 'FIBER_CUT'
        })
      });
      const data = await res.json();
      setTelegramLogs(data);
    } catch (err) {
      setTelegramLogs({ success: false, error: err.message });
    } finally {
      setIsSendingTelegram(false);
    }
  };

  // Dynamic Signal Power Bar & Color Threshold Helper
  const getPowerStatus = (powerStr) => {
    const power = parseFloat(powerStr);
    if (isNaN(power)) return { color: 'text-slate-400', bg: 'bg-slate-500', label: 'N/A', width: '0%' };
    
    if (power >= -20) {
      return { 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500', 
        border: 'border-emerald-500/20',
        badge: 'bg-emerald-500/10 text-emerald-400',
        label: 'Optimal', 
        width: '90%' 
      };
    } else if (power >= -25) {
      return { 
        color: 'text-amber-400', 
        bg: 'bg-amber-500', 
        border: 'border-amber-500/20',
        badge: 'bg-amber-500/10 text-amber-400',
        label: 'Warning / Low', 
        width: '55%' 
      };
    } else {
      return { 
        color: 'text-red-400', 
        bg: 'bg-red-500', 
        border: 'border-red-500/20',
        badge: 'bg-red-500/10 text-red-400',
        label: 'Critical / Drop', 
        width: '25%' 
      };
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-100 min-h-screen">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                OLT Management System
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 uppercase tracking-widest">
                  v3.8 Mesh
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoring GPON/EPON, manajemen ONU/ONT, dan kontrol real-time kluster OLT.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/olt/visualizer"
            className="px-3.5 py-2 rounded-xl bg-blue-900/40 border border-blue-500/50 text-blue-300 hover:text-white hover:bg-blue-600 transition text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Server className="w-4 h-4 text-blue-400" />
            <span>Visualizer 2D Chassis</span>
          </Link>
          <button 
            onClick={() => setShowAdvancedModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-black/10"
          >
            <Settings className="w-4 h-4 text-blue-400" />
            <span>Pengaturan OLT</span>
          </button>


          <div className="flex items-center gap-1.5 border-l border-slate-700/80 pl-3">
            <button className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer">
              <User className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── FEATURE 1 & 2: Real-time Innovative MVP Banners ─── */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Banner Feature 1: Auto-Discovery ONU Unregistered */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                  SNMP Trap Listener • Auto-Discovery
                </span>
                <h3 className="text-sm font-black text-white">
                  {unregisteredOnus.length > 0
                    ? `${unregisteredOnus.length} Unregistered ONU Terdeteksi!`
                    : 'Tidak ada ONU Unregistered Baru'}
                </h3>
              </div>
            </div>
            {unregisteredOnus.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black animate-pulse border border-blue-500/30">
                LIVE TRAP
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium">
            Modem baru terpasang di rumah pelanggan terdeteksi otomatis via SNMP Trap OLT. Klik 1-Click Auto Provision untuk menginjeksi Profile, VLAN & PPPoE.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {unregisteredOnus.length > 0 ? (
              <button
                onClick={() => {
                  setSelectedUnregOnu(unregisteredOnus[0]);
                  setShowProvisionModal(true);
                  setProvisionState('idle');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" /> 1-Click Auto Provision
              </button>
            ) : (
              <button
                onClick={handleSimulateTrap}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                Simulasi SNMP Trap Masuk
              </button>
            )}
            <button
              onClick={handleSimulateTrap}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition"
            >
              + Simulasikan Trap
            </button>
          </div>
        </div>

        {/* Banner Feature 2: Early Warning Telegram Bot Alerts */}
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black text-red-400 uppercase tracking-wider block">
                  Early-Warning Engine • Telegram Bot
                </span>
                <h3 className="text-sm font-black text-white">
                  Alert Redaman Kritis & Fiber Cut
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-black border border-red-500/30">
              ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium">
            Mendeteksi otomatis sinyal low (&lt;-25.0 dBm) atau Fiber Cut 1 PON Port mati. Mengirimkan koordinat ODP ke Telegram Bot.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setShowTelegramModal(true);
                handleTestTelegramBotAlert();
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" /> Tes Alert Telegram Bot
            </button>
            <Link
              href="/admin/olt/location"
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/80 transition flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Buka GIS Map ODP
            </Link>
          </div>
        </div>

      </div>

      {/* ─── Real-time Technical Status Indicators & Uplink Selection Bar ─── */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-lg shadow-black/10">
        
        {/* Status Indicators with Pulse Animation */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">VPN Tunnel:</span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">SNMP Poller:</span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active (10s)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">ACS Auto-Config:</span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Quick Filter Dropdown Uplink Selection */}
        <div className="w-full md:w-auto min-w-[240px] relative">
          <select 
            value={selectedUplink}
            onChange={(e) => setSelectedUplink(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer appearance-none shadow-inner"
          >
            <option value="">-- Semua Uplink OLT --</option>
            <option value="UPLINK_PDH">UPLINK_PDH (Padaherang Core)</option>
            <option value="UPLINK_MNJ05">UPLINK_MNJ05 (Mangunjaya Feed)</option>
            <option value="UPLINK_PHO2">UPLINK_PHO2 (Padaherang Sub)</option>
            <option value="UPLINK_KALIPUCANG">UPLINK_KALIPUCANG (Kalipucang Relay)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ─── Metric Cards (4-Column Layout: Desktop 4, Tablet 2, Mobile 1) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total ONT Watched */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/10 bg-gradient-to-br from-blue-500/10 to-transparent hover:border-blue-500/40 transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">Total ONT Terdaftar</span>
              <div className="text-3xl font-black text-white tracking-tight mt-1">968</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-3 font-medium border-t border-slate-700/50 pt-2">
            <span className="text-emerald-400 font-bold">GPON: 920</span>
            <span>|</span>
            <span className="text-blue-400 font-bold">EPON: 48</span>
          </div>
        </div>

        {/* Card 2: ONT Online (Emerald #10b981) */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/10 bg-gradient-to-br from-emerald-500/10 to-transparent hover:border-emerald-500/40 transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">ONT Online</span>
              <div className="text-3xl font-black text-emerald-400 tracking-tight mt-1">903</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 font-medium border-t border-slate-700/50 pt-2">
            <span>Rasio Aktivitas:</span>
            <span className="text-emerald-400 font-bold">93.28% Active</span>
          </div>
        </div>

        {/* Card 3: ONT Offline (Red #ef4444) */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/10 bg-gradient-to-br from-red-500/10 to-transparent hover:border-red-500/40 transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-red-400 uppercase tracking-wider block">ONT Offline</span>
              <div className="text-3xl font-black text-red-400 tracking-tight mt-1">65</div>
            </div>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-3 font-medium border-t border-slate-700/50 pt-2">
            <span className="text-red-400 font-bold">PwrFail: 55</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">LOS: 5</span>
            <span>•</span>
            <span>N/A: 5</span>
          </div>
        </div>

        {/* Card 4: Low Signals / Warning (Amber #f59e0b) */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg shadow-black/10 bg-gradient-to-br from-amber-500/10 to-transparent hover:border-amber-500/40 transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">Redaman Sinyal Low</span>
              <div className="text-3xl font-black text-amber-400 tracking-tight mt-1">524</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 font-medium border-t border-slate-700/50 pt-2">
            <span className="text-amber-400 font-bold">Warning (-20 to -25dBm): 462</span>
            <span className="text-red-400 font-bold">Kritis (&lt;-25dBm): 62</span>
          </div>
        </div>

      </div>

      {/* ─── Diagram Topologi Asset (Adaptif: Accordion on Mobile, Scaled on Tablet, Full on Desktop) ─── */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg shadow-black/10">
        
        {/* Accordion Header for Mobile Toggle */}
        <button 
          onClick={() => setIsTopologyAccordionOpen(!isTopologyAccordionOpen)}
          className="w-full p-4 bg-slate-900/40 flex items-center justify-between border-b border-slate-700/50 text-left cursor-pointer hover:bg-slate-800/60 transition"
        >
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Diagram Topologi Aset Jaringan (Cloud - MikroTik - OLT)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
              {isTopologyAccordionOpen ? 'Sembunyikan Diagram' : 'Tampilkan Diagram'}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isTopologyAccordionOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Accordion Content */}
        {isTopologyAccordionOpen && (
          <div className="p-6 md:p-8 flex items-center justify-center overflow-x-auto">
            
            {/* Diagram Container with Tablet Scaling (85%) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 min-w-[600px] md:scale-[0.85] lg:scale-100 transition-transform">
              
              {/* Core / Cloud Node */}
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 group-hover:scale-105 transition">
                  <Database className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black text-slate-300 tracking-wide uppercase">Core Network</span>
                <span className="text-[9px] text-slate-500">Cloudflare Tunnel</span>
              </div>

              {/* Connecting Line 1 */}
              <div className="w-[1.5px] h-8 md:w-16 md:h-[1.5px] bg-slate-700 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-sm shadow-purple-500" />
              </div>

              {/* Router Node */}
              <div className="flex flex-col items-center gap-2 group">
                <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-center min-w-[140px] group-hover:border-blue-500/50 transition">
                  <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-blue-400 block">MikroTik CCR2004</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">PPPoE & Gateway</span>
                </div>
              </div>

              {/* Connecting Line 2 */}
              <div className="w-[1.5px] h-8 md:w-16 md:h-[1.5px] bg-slate-700 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
              </div>

              {/* OLT Node */}
              <div className="flex flex-col items-center gap-2 group">
                <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center min-w-[150px] shadow-lg shadow-emerald-500/5 group-hover:scale-105 transition">
                  <Server className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-emerald-400 block">ZTE C320 OLT</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">10G Uplink mgt1</span>
                </div>
              </div>

              {/* Connecting Line 3 */}
              <div className="w-[1.5px] h-8 md:w-16 md:h-[1.5px] bg-slate-700 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-500" />
              </div>

              {/* ONU Cluster Node */}
              <div className="flex flex-col items-center gap-2 group">
                <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-center min-w-[140px] group-hover:border-amber-500/50 transition">
                  <Wifi className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-amber-400 block">968 ONU / ONT</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">FTTH Cluster Access</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ─── Main Navigation Tabs (ONU List, Topology, Location, Logs) ─── */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg shadow-black/10">
        
        {/* Navigation Header */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'onu', label: 'ONU List', icon: Layers },
              { key: 'topology', label: 'Topology GPON', icon: Network },
              { key: 'location', label: 'Location Map', icon: MapPin },
              { key: 'logs', label: 'Logs & Reports', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Action Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari ONU, SN, MAC, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500 transition"
              />
            </div>
            
            <button className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah ONU</span>
            </button>
          </div>
        </div>

        {/* ─── TAB 1: ONU LIST ─── */}
        {activeTab === 'onu' && (
          <div className="p-4 space-y-4">
            
            {/* Desktop & Tablet Table View (hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-3">ONU Interface ID</th>
                    <th className="px-4 py-3">Nama Pelanggan / Device</th>
                    <th className="px-4 py-3">OLT Host</th>
                    <th className="px-4 py-3">Status Connection</th>
                    <th className="px-4 py-3">Redaman RX Power</th>
                    <th className="px-4 py-3 text-right">Aksi Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40 text-xs">
                  {onuList
                    .filter(onu => onu.name.toLowerCase().includes(searchQuery.toLowerCase()) || onu.id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((onu, idx) => {
                      const powerInfo = getPowerStatus(onu.power);
                      return (
                        <tr 
                          key={idx}
                          className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            selectedOnu.id === onu.id ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => {
                            setSelectedOnu(onu);
                            setShowOnuDetailSlideover(true);
                          }}
                        >
                          <td className="px-4 py-3.5 font-bold font-mono text-blue-400">{onu.id}</td>
                          <td className="px-4 py-3.5 font-medium text-slate-200">
                            <div>{onu.name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">SN: {onu.sn}</span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">{onu.olt}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              onu.status === 'Online' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                              {onu.status} {onu.cause !== 'Normal' ? `(${onu.cause})` : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col min-w-[120px]">
                              <span className={`font-bold ${powerInfo.color}`}>
                                {onu.power} dBm <span className="text-[10px] font-normal opacity-80">({powerInfo.label})</span>
                              </span>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-slate-700/50">
                                <div className={`h-full rounded-full ${powerInfo.bg}`} style={{ width: powerInfo.width }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOnu(onu);
                                setShowOnuDetailSlideover(true);
                              }}
                              className="px-3 py-1 text-[11px] font-bold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detail & Konfig
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (<767px Responsive Transformation) */}
            <div className="md:hidden space-y-3">
              {onuList
                .filter(onu => onu.name.toLowerCase().includes(searchQuery.toLowerCase()) || onu.id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((onu, idx) => {
                  const powerInfo = getPowerStatus(onu.power);
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedOnu(onu);
                        setShowOnuDetailSlideover(true);
                      }}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-3 cursor-pointer hover:border-blue-500/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-400">{onu.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          onu.status === 'Online' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {onu.status}
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">{onu.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">SN: {onu.sn} | VLAN: {onu.vlan}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Sinyal RX Power</span>
                          <span className={`text-xs font-bold ${powerInfo.color}`}>{onu.power} dBm</span>
                        </div>

                        <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                          Konfigurasi <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ─── TAB 2: TOPOLOGY GPON ─── */}
        {activeTab === 'topology' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" /> Visualisasi Topologi GPON Kluster
            </h3>
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white">Interactive GPON Topology Tree Active</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Menampilkan sebaran port GPON 0/1 hingga 0/16 dengan pemetaan splitter 1:8 dan 1:16 secara real-time.
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB 3: LOCATION MAP ─── */}
        {activeTab === 'location' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Sebaran Geografis Perangkat OLT/ONU
            </h3>
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center space-y-3">
              <MapPin className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-white">Geographic Map Grid Loaded</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Integrasi koordinat GPS OLT Padaherang, Mangunjaya, dan Kalipucang siap dipantau.
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB 4: LOGS & REPORTS ─── */}
        {activeTab === 'logs' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> System Activity & Trap Logs
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 space-y-2 border border-slate-700/60 max-h-64 overflow-y-auto">
              <div className="text-emerald-400">[2026-07-26 01:50:12] SNMP TRAP: ONU gpon-onu_0/2/10 Status ONLINE (RX: -11.8 dBm)</div>
              <div className="text-red-400">[2026-07-26 01:48:30] SNMP TRAP: ONU gpon-onu_0/1/15 PowerFail Alert (RX: -25.2 dBm)</div>
              <div className="text-blue-400">[2026-07-26 01:45:00] ACS Auto-Config Sync completed for 968 devices.</div>
            </div>
          </div>
        )}

      </div>

      {/* ─── SLIDE-OVER / MODAL DETAIL ONU (Advanced Configuration) ─── */}
      {showOnuDetailSlideover && selectedOnu && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-800 border-l border-slate-700 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between h-full">
            <div>
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div>
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-400" /> Detail ONU Configuration
                  </h3>
                  <span className="text-xs font-mono text-blue-400 font-bold">{selectedOnu.id}</span>
                </div>
                <button 
                  onClick={() => setShowOnuDetailSlideover(false)}
                  className="p-2 rounded-xl bg-slate-700/60 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Device Overview */}
              <div className="mt-5 space-y-4 text-xs">
                
                {/* Dynamic Signal RX Power Bar Indicator */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Signal RX Power</span>
                    <span className={`font-black text-sm ${getPowerStatus(selectedOnu.power).color}`}>
                      {selectedOnu.power} dBm
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getPowerStatus(selectedOnu.power).bg}`} 
                      style={{ width: getPowerStatus(selectedOnu.power).width }} 
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Threshold Limit: -27.0 dBm</span>
                    <span className="font-bold">{getPowerStatus(selectedOnu.power).label}</span>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2.5 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Nama Pelanggan</span>
                    <span className="font-bold text-white">{selectedOnu.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">SN / MAC Address</span>
                    <span className="font-mono font-bold text-blue-400">{selectedOnu.sn}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">OLT Host</span>
                    <span className="font-bold text-white">{selectedOnu.olt}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">IP Target WAN</span>
                    <span className="font-mono font-bold text-slate-200">{selectedOnu.ip}</span>
                  </div>
                </div>

                {/* Quick Action Profile Selectors */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Quick Profile Configuration</span>
                  
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">T-CONT Profile</label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500">
                      <option>T-CONT_100M_FULL (Default)</option>
                      <option>T-CONT_50M_STANDARD</option>
                      <option>T-CONT_200M_PREMIUM</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">GEM-Port & VLAN Service</label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500">
                      <option>GEM 1 - VLAN {selectedOnu.vlan} (Internet PPPoE)</option>
                      <option>GEM 2 - VLAN 200 (IPTV Broadcast)</option>
                      <option>GEM 3 - VLAN 300 (VoIP SIP)</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-700 space-y-2">
              <button 
                onClick={() => setShowOnuDetailSlideover(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan & Apply ke OLT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADVANCED SETTINGS MODAL ─── */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" /> Advanced OLT Cluster Configuration
              </h3>
              <button onClick={() => setShowAdvancedModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0" />
                <div>
                  <div className="font-bold text-white">Auto-Discovery Unauthenticated ONT</div>
                  <div className="text-[10px] text-slate-400">Deteksi otomatis ONT baru di port GPON</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0" />
                <div>
                  <div className="font-bold text-white">SNMP Polling Auto-Refresh (10s)</div>
                  <div className="text-[10px] text-slate-400">Perbarui statistik sinyal RX/TX setiap 10 detik</div>
                </div>
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                onClick={() => setShowAdvancedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-600 transition"
              >
                Batal
              </button>
              <button 
                onClick={() => setShowAdvancedModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FEATURE 1: 1-CLICK AUTO PROVISIONING MODAL ─── */}

      {showProvisionModal && selectedUnregOnu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">1-Click Auto Provisioning ONU</h3>
                  <p className="text-xs text-slate-400">Injeksi otomatis Speed Profile, VLAN, dan akun PPPoE via Telnet/TR-069</p>
                </div>
              </div>
              <button onClick={() => setShowProvisionModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            {/* Target ONU Info */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">SERIAL NUMBER (SN)</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{selectedUnregOnu.sn}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">VENDOR / MODEL</span>
                <span className="font-bold text-slate-200">{selectedUnregOnu.vendor} - {selectedUnregOnu.model}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">OLT & PORT GPON</span>
                <span className="font-bold text-slate-200">{selectedUnregOnu.olt_id} ({selectedUnregOnu.pon_port})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-bold">SINYAL REDAMAN</span>
                <span className="font-bold text-emerald-400">{selectedUnregOnu.rx_power} dBm (Optimal)</span>
              </div>
            </div>

            {/* Provision Form */}
            {provisionState === 'idle' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    value={provisionForm.customer_name}
                    onChange={(e) => setProvisionForm({ ...provisionForm, customer_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Speed Profile</label>
                    <select
                      value={provisionForm.speed_profile}
                      onChange={(e) => setProvisionForm({ ...provisionForm, speed_profile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="PROFILE_20M">PROFILE_20M (Home Starter)</option>
                      <option value="PROFILE_50M">PROFILE_50M (Home Family)</option>
                      <option value="PROFILE_100M">PROFILE_100M (Pro Streamer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">VLAN Service</label>
                    <input
                      type="number"
                      value={provisionForm.vlan}
                      onChange={(e) => setProvisionForm({ ...provisionForm, vlan: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">PPPoE Username</label>
                    <input
                      type="text"
                      value={provisionForm.pppoe_user}
                      onChange={(e) => setProvisionForm({ ...provisionForm, pppoe_user: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">PPPoE Password</label>
                    <input
                      type="text"
                      value={provisionForm.pppoe_password}
                      onChange={(e) => setProvisionForm({ ...provisionForm, pppoe_password: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terminal Console Log Feedback */}
            {provisionState !== 'idle' && (
              <div className="p-4 rounded-xl bg-black font-mono text-[11px] text-emerald-400 space-y-1.5 border border-slate-800 max-h-60 overflow-y-auto">
                <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800 font-bold">--- TELNET & TR-069 EXECUTION LOG ---</div>
                {provisionConsoleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-600">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              {provisionState === 'idle' ? (
                <>
                  <button
                    onClick={() => setShowProvisionModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleExecute1ClickProvision}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Eksekusi 1-Click Provisioning
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowProvisionModal(false);
                    setProvisionState('idle');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg shadow-emerald-600/30"
                >
                  Selesai & Tutup Modal
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── FEATURE 2: TELEGRAM EARLY WARNING TEST MODAL ─── */}
      {showTelegramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" /> Early-Warning Telegram Bot Alert Engine
              </h3>
              <button onClick={() => setShowTelegramModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Sistem backend mendeteksi redaman sinyal kritis (&gt; -25.0 dBm) dan insiden Fiber Cut, lalu memicu pengiriman notifikasi instan ke grup Telegram NOC beserta link koordinat GIS ODP.
            </p>

            {/* Test Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <button
                onClick={handleTestTelegramBotAlert}
                disabled={isSendingTelegram}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingTelegram ? 'Mengirim Telegram Alert...' : '🚀 Picu Alert Fiber Cut (ODP-PDH-04)'}</span>
              </button>

              {telegramLogs && (
                <div className="mt-3 p-3.5 rounded-xl bg-black border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-400 text-[10px] font-bold border-b border-slate-800 pb-1">
                    TELEGRAM API PAYLOAD RESULT:
                  </div>
                  <pre className="text-emerald-400 text-[10px] whitespace-pre-wrap overflow-x-auto">
                    {telegramLogs.messagePayload || JSON.stringify(telegramLogs, null, 2)}
                  </pre>
                  {telegramLogs.telegramSent && (
                    <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Pesan Telegram Berhasil Diterima oleh Bot API!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <Link
                href="/admin/olt/location"
                className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" /> Buka Map GIS ODP Lengkap &gt;
              </Link>
              <button
                onClick={() => setShowTelegramModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

