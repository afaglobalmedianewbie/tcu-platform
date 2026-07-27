'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Server, Cpu, ShieldCheck, Zap, AlertTriangle, CheckCircle2, 
  MapPin, RefreshCw, Layers, Activity, ArrowLeft, Database, Download, Terminal, Wifi,
  Globe, Radio, HardDrive, Bot, ExternalLink, Filter, Play, Check, X, Info, Settings,
  RotateCw, Plus, ChevronRight, Eye, ShieldAlert
} from 'lucide-react';

export default function OltChassisVisualizerPage() {
  const [activeTab, setActiveTab] = useState('chassis'); // 'chassis', 'topology', 'onus'
  const [portFilter, setPortFilter] = useState('ALL'); // 'ALL', 'GREEN', 'YELLOW', 'RED', 'GRAY'
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [actionBanner, setActionBanner] = useState(null);

  // Active Modals State
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [showGisModal, setShowGisModal] = useState(false);
  const [showRebootModal, setShowRebootModal] = useState(null); // stores ONU object when open
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Self-Contained Webbase Mock Data (Does not require external hardware connection)
  const initialChassisData = {
    olt_id: 'OLT_PADAHERANG',
    name: 'OLT ZTE ZXA10 C320 Padaherang Core',
    brand: 'ZTE',
    model: 'C320',
    chassis_type: '2-Slot GPON + 2-Slot Power/Uplink',
    ip_management: '172.29.205.62',
    snmp_community_ro: 'tcuro',
    snmp_community_rw: 'tcurw',
    vpn_status: 'CONNECTED_VPN',
    uptime: '45d 12h 34m',
    slots: [
      {
        slot_no: 1,
        card_type: 'GTGH',
        card_name: '16-Port GPON Line Card',
        status: 'ONLINE',
        total_ports: 16,
        ports: Array.from({ length: 16 }, (_, i) => {
          const portNo = i + 1;
          let status = 'GREEN';
          let rxAvg = -18.5 - (i * 0.3);
          let activeOnus = 20 - i;
          if (portNo === 4) { status = 'YELLOW'; rxAvg = -24.2; }
          if (portNo === 8) { status = 'RED'; rxAvg = -31.4; activeOnus = 0; }
          if (portNo > 12) { status = 'GRAY'; rxAvg = 0; activeOnus = 0; }
          return {
            port_no: portNo,
            port_label: `1/1/${portNo}`,
            status,
            active_onus: activeOnus,
            avg_rx_dbm: rxAvg,
            odp_code: `ODP-PDH-0${(portNo % 4) + 1}`,
            vlan: 100 + portNo
          };
        })
      },
      {
        slot_no: 2,
        card_type: 'GTGH',
        card_name: '16-Port GPON Line Card',
        status: 'ONLINE',
        total_ports: 16,
        ports: Array.from({ length: 16 }, (_, i) => {
          const portNo = i + 1;
          let status = 'GREEN';
          let rxAvg = -19.1 - (i * 0.2);
          let activeOnus = 18 - i;
          if (portNo === 2) { status = 'YELLOW'; rxAvg = -24.8; }
          if (portNo > 10) { status = 'GRAY'; rxAvg = 0; activeOnus = 0; }
          return {
            port_no: portNo,
            port_label: `1/2/${portNo}`,
            status,
            active_onus: activeOnus,
            avg_rx_dbm: rxAvg,
            odp_code: `ODP-PDH-0${(portNo % 4) + 5}`,
            vlan: 200 + portNo
          };
        })
      },
      {
        slot_no: 3,
        card_type: 'UCDC/3',
        card_name: 'DC Power & 10G/1G Uplink Card',
        status: 'ONLINE',
        uplinks: [
          { name: 'gei_1/3/1', speed: '1 Gbps', status: 'UP', txKbps: 450000 },
          { name: 'xgei_1/3/1', speed: '10 Gbps', status: 'UP', txKbps: 920000 }
        ]
      },
      {
        slot_no: 4,
        card_type: 'UCDC/3',
        card_name: 'Redundant DC Power & 10G Uplink Card',
        status: 'ONLINE',
        uplinks: [
          { name: 'gei_1/4/1', speed: '1 Gbps', status: 'BACKUP_STANDBY', txKbps: 0 }
        ]
      }
    ]
  };

  const [chassisData, setChassisData] = useState(initialChassisData);
  const [selectedPort, setSelectedPort] = useState(initialChassisData.slots[0].ports[0]);

  // Mock list of ONUs under the selected port for the detailed inspector table
  const mockOnus = [
    { id: 1, name: 'BENDINELADI_ZIZI-BRZ', sn: 'ZTEGC08A9312', type: 'ZTE F609 v3', rx_power: -18.5, status: 'Online', pppoe: 'zizi_net@tcu.net', ip: '10.200.15.102', odp: 'ODP-PDH-01/08' },
    { id: 2, name: 'CUSTOMER_A_NET', sn: 'HWTC8892A110', type: 'Huawei HG8245H', rx_power: -25.2, status: 'Warning', pppoe: 'customer_a@tcu.net', ip: '10.200.15.103', odp: 'ODP-PDH-02/08' },
    { id: 3, name: 'WARUNG_KOPI_BAROKAH', sn: 'ZTEGC992B104', type: 'ZTE F609', rx_power: -17.9, status: 'Online', pppoe: 'warkop@tcu.net', ip: '10.200.18.45', odp: 'ODP-PDH-01/08' },
    { id: 4, name: 'POS_SEKURITI_PERUM', sn: 'ZTEGC771A909', type: 'ZTE F660', rx_power: -19.2, status: 'Online', pppoe: 'sekuriti@tcu.net', ip: '10.200.10.88', odp: 'ODP-PDH-03/16' }
  ];

  // Provisioning Form State
  const [provisionForm, setProvisionForm] = useState({
    customer_name: 'Bpk. Ahmad Suherman',
    sn: 'ZTEG-C08A9912',
    speed_profile: 'PROFILE_50M',
    vlan: 100,
    pppoe_user: 'ahmad_suherman@tcu.net',
    pppoe_password: 'pass_' + Math.floor(1000 + Math.random() * 9000)
  });

  const triggerBanner = (type, text) => {
    setActionBanner({ type, text });
    setTimeout(() => setActionBanner(null), 4000);
  };

  const handleRefreshRack = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerBanner('success', 'Refresh Rack OLT berhasil! Sinyal telemetri terbarui.');
    }, 800);
  };

  const handleConfirmBackup = () => {
    setShowBackupModal(false);
    triggerBanner('success', 'Backup OLT startup-config (startrun.dat - 394 KB) berhasil dibuat & tersimpan di Cloud!');
  };

  const handleSendTelegramAlert = () => {
    setShowTelegramModal(false);
    triggerBanner('success', `Telegram NOC Alert untuk ${selectedPort?.odp_code || 'ODP-PDH-01'} berhasil disimulasikan & dikirim!`);
  };

  const handleConfirmProvision = (e) => {
    e.preventDefault();
    setShowProvisionModal(false);
    triggerBanner('success', `1-Click Auto Provisioning berhasil untuk SN: ${provisionForm.sn} di Port ${selectedPort.port_label}!`);
  };

  const handleConfirmReboot = () => {
    const onu = showRebootModal;
    setShowRebootModal(null);
    triggerBanner('info', `Perintah TR-069 Reboot berhasil dikirim ke ONT ${onu?.name} (${onu?.sn}). Modem mere-start.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-100 min-h-screen pb-16 font-sans">
      
      {/* Top Banner Message */}
      {actionBanner && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xl transition-all ${
          actionBanner.type === 'success' ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-300' :
          actionBanner.type === 'error' ? 'bg-red-950/90 border border-red-500 text-red-300' :
          'bg-blue-950/90 border border-blue-500 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {actionBanner.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {actionBanner.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {actionBanner.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />}
            <span>{actionBanner.text}</span>
          </div>
          <button onClick={() => setActionBanner(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/olt" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                COMPANY-NETWORK MODULE 2
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                WEBBASE WIREFRAME MOCK
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1 font-outfit">
              <Server className="w-6 h-6 text-blue-400" /> Visualizer Chassis 2D OLT ZTE C320
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Peta interaktif rack fisik 2D, status LED port GPON real-time, topologi kabel optik end-to-end, dan kontrol workflow
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefreshRack}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh Rack
          </button>

          <button
            onClick={() => setShowBackupModal(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-bold transition flex items-center gap-2 border border-violet-500/30"
          >
            <HardDrive className="w-3.5 h-3.5 text-violet-400" /> Backup OLT
          </button>

          <button
            onClick={() => setShowTelegramModal(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-bold transition flex items-center gap-2 border border-sky-500/30"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" /> Test Telegram Alert
          </button>

          <button
            onClick={() => setShowGisModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" /> GIS Map ODP
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('chassis')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'chassis'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> 2D Chassis Rack Visualizer
        </button>

        <button
          onClick={() => setActiveTab('topology')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'topology'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" /> Visual Network Mock Topology (2D SVG)
        </button>

        <button
          onClick={() => setActiveTab('onus')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
            activeTab === 'onus'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-4 h-4" /> Client ONUs Status Table
        </button>
      </div>

      {/* ─── TAB 1: 2D CHASSIS RACK VISUALIZER ─────────────────────────────────── */}
      {activeTab === 'chassis' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: 2D Chassis Slot Rack Visualizer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              
              {/* Rack Name & Port Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">{chassisData.name}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">{chassisData.chassis_type}</span>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                  {[
                    { key: 'ALL', label: 'Semua Port' },
                    { key: 'GREEN', label: 'Normal' },
                    { key: 'YELLOW', label: 'Warning' },
                    { key: 'RED', label: 'Cut Total' },
                    { key: 'GRAY', label: 'Kosong' }
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setPortFilter(f.key)}
                      className={`px-2.5 py-1 rounded transition font-bold ${
                        portFilter === f.key
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2D Chassis Slots Container */}
              <div className="space-y-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {chassisData.slots.map((slot) => (
                  <div key={slot.slot_no} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono text-[11px] font-bold border border-blue-500/30">
                          SLOT {slot.slot_no}
                        </span>
                        <span className="text-xs font-bold text-white">{slot.card_type}</span>
                        <span className="text-[11px] text-slate-400">({slot.card_name})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {slot.status}
                      </span>
                    </div>

                    {/* Render GPON Ports Grid (Slots 1 & 2) */}
                    {slot.ports && (
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                        {slot.ports
                          .filter(p => portFilter === 'ALL' || p.status === portFilter)
                          .map((port) => {
                            const isSelected = selectedPort?.port_label === port.port_label;
                            let bgClass = "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600";
                            let ledClass = "bg-slate-600";
                            
                            if (port.status === 'GREEN') {
                              bgClass = isSelected ? "bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-500" : "bg-slate-900 border-emerald-500/40 text-emerald-400 hover:border-emerald-500";
                              ledClass = "bg-emerald-500 shadow-sm shadow-emerald-500";
                            } else if (port.status === 'YELLOW') {
                              bgClass = isSelected ? "bg-yellow-950/90 border-yellow-500 text-yellow-300 shadow-lg shadow-yellow-500/30 ring-1 ring-yellow-500" : "bg-slate-900 border-yellow-500/40 text-yellow-400 hover:border-yellow-500";
                              ledClass = "bg-yellow-500 shadow-sm shadow-yellow-500 animate-pulse";
                            } else if (port.status === 'RED') {
                              bgClass = isSelected ? "bg-red-950/90 border-red-500 text-red-300 shadow-lg shadow-red-500/30 ring-1 ring-red-500" : "bg-slate-900 border-red-500/40 text-red-400 hover:border-red-500";
                              ledClass = "bg-red-500 shadow-sm shadow-red-500 animate-ping";
                            }

                            return (
                              <button
                                key={port.port_no}
                                onClick={() => setSelectedPort(port)}
                                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-between gap-1.5 ${bgClass}`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${ledClass}`} />
                                  <span className="font-mono text-[10px] font-black">P{port.port_no}</span>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400">{port.avg_rx_dbm ? `${port.avg_rx_dbm}dB` : 'OFF'}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}

                    {/* Render Uplink Interfaces (Slots 3 & 4) */}
                    {slot.uplinks && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        {slot.uplinks.map((up, idx) => (
                          <div key={idx} className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${up.status === 'UP' ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-slate-600'}`} />
                              <span className="font-mono text-xs font-bold text-white">{up.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-blue-400 font-bold">{up.speed}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Port Inspector Panel */}
          <div className="space-y-4">
            {selectedPort ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl sticky top-20">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">INSPEKSI PORT GPON</span>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      Port {selectedPort.port_label}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border ${
                    selectedPort.status === 'GREEN' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    selectedPort.status === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {selectedPort.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Total Active ONU</span>
                    <span className="font-mono font-bold text-white">{selectedPort.active_onus} Perangkat</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Rata-rata Sinyal RX</span>
                    <span className="font-mono font-bold text-emerald-400">{selectedPort.avg_rx_dbm} dBm</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Target ODP Mapping</span>
                    <span className="font-mono font-bold text-blue-400">{selectedPort.odp_code}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">VLAN Config</span>
                    <span className="font-mono font-bold text-violet-400">VLAN {selectedPort.vlan}</span>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setShowProvisionModal(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> 1-Click Auto Provisioning di Port Ini
                  </button>

                  <button
                    onClick={() => setShowGisModal(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> Inspeksi GIS ODP {selectedPort.odp_code}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Klik salah satu port GPON di atas untuk melihat detail inspeksi
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: VISUAL NETWORK MOCK TOPOLOGY (2D SVG) ─────────────────────── */}
      {activeTab === 'topology' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">NETWORK END-TO-END VISUAL TOPOLOGY MOCK</span>
              <h3 className="text-lg font-black text-white">Visual Network Flow & Fiber Link Diagram</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Wireframe Stream
            </span>
          </div>

          {/* SVG Diagram Representation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px] flex items-center justify-between gap-8 py-8 relative">
              
              {/* Node 1: Core Router */}
              <div className="flex flex-col items-center gap-2 z-10 cursor-pointer hover:scale-105 transition" onClick={() => triggerBanner('info', 'Node Selected: Core Router CCR1036 pada 10.10.10.1')}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold">
                  <Zap className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white">CCR1036 Core</span>
                <span className="text-[10px] font-mono text-slate-400">10.10.10.1 (Bitmix)</span>
              </div>

              {/* Connecting Line 1 */}
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 relative flex items-center justify-center">
                <span className="absolute -top-5 text-[10px] font-mono text-blue-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-blue-500/30">
                  10G Fiber Uplink
                </span>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              </div>

              {/* Node 2: ZTE C320 OLT */}
              <div className="flex flex-col items-center gap-2 z-10 cursor-pointer hover:scale-105 transition" onClick={() => triggerBanner('info', 'Node Selected: OLT ZTE ZXA10 C320 Padaherang')}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white font-bold">
                  <Server className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white">ZTE C320 OLT</span>
                <span className="text-[10px] font-mono text-slate-400">172.29.205.62</span>
              </div>

              {/* Connecting Line 2 */}
              <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 relative flex items-center justify-center">
                <span className="absolute -top-5 text-[10px] font-mono text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
                  GPON PON Port 1/1/4
                </span>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>

              {/* Node 3: ODP Splitter */}
              <div className="flex flex-col items-center gap-2 z-10 cursor-pointer hover:scale-105 transition" onClick={() => setShowGisModal(true)}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white font-bold">
                  <Layers className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white">ODP-PDH-01 (1:8)</span>
                <span className="text-[10px] font-mono text-slate-400">Padaherang RT 02</span>
              </div>

              {/* Connecting Line 3 */}
              <div className="flex-1 h-1 bg-gradient-to-r from-amber-500 to-violet-500 relative flex items-center justify-center">
                <span className="absolute -top-5 text-[10px] font-mono text-violet-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-violet-500/30">
                  Drop-Cable 50m
                </span>
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              </div>

              {/* Node 4: ONT Subscriber */}
              <div className="flex flex-col items-center gap-2 z-10 cursor-pointer hover:scale-105 transition" onClick={() => triggerBanner('info', 'Node Selected: ONT F609 Bpk. Zizi (-18.5 dBm)')}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white font-bold">
                  <Wifi className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white">ONT F609 (Pelanggan)</span>
                <span className="text-[10px] font-mono text-slate-400">RX: -18.5 dBm</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: CLIENT ONUS STATUS TABLE ─────────────────────────────────── */}
      {activeTab === 'onus' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">CONNECTED ONT SUBSCRIBERS</span>
              <h3 className="text-lg font-black text-white">Daftar Pelanggan & Status Sinyal Optik Real-Time</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">4 Devices Connected</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[11px]">
                  <th className="p-3 font-bold">NAMA PELANGGAN</th>
                  <th className="p-3 font-bold">SERIAL NUMBER</th>
                  <th className="p-3 font-bold">MODEL ONT</th>
                  <th className="p-3 font-bold">ODP TARGET</th>
                  <th className="p-3 font-bold">PPPoE USER</th>
                  <th className="p-3 font-bold">SINYAL RX</th>
                  <th className="p-3 font-bold">STATUS</th>
                  <th className="p-3 font-bold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {mockOnus.map((onu) => (
                  <tr key={onu.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-white">{onu.name}</td>
                    <td className="p-3 text-blue-400">{onu.sn}</td>
                    <td className="p-3 text-slate-300">{onu.type}</td>
                    <td className="p-3 text-amber-400">{onu.odp}</td>
                    <td className="p-3 text-slate-400">{onu.pppoe}</td>
                    <td className="p-3 font-bold text-emerald-400">{onu.rx_power} dBm</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        onu.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {onu.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setShowRebootModal(onu)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition border border-slate-700"
                      >
                        🔄 Reboot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: BACKUP OLT CONFIG ────────────────────────────────────────── */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-violet-400" /> Backup Konfigurasi OLT
              </h3>
              <button onClick={() => setShowBackupModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem akan meng-export konfigurasi `startrun.dat` (10,879 baris, 394 KB) dari OLT ZTE C320 Padaherang dan menyimpannya di Cloud Storage terenkripsi.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] space-y-1 text-slate-400">
              <p>• OLT Device: OLT_PADAHERANG (172.29.205.62)</p>
              <p>• File Target: ZTE_C320_startrun.dat</p>
              <p>• Transport: Telnet / TFTP via Management VPN</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowBackupModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">Batal</button>
              <button onClick={handleConfirmBackup} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30">Proses Backup</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: TEST TELEGRAM ALERT NOC ─────────────────────────────────── */}
      {showTelegramModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-sky-400" /> Simulasi Telegram NOC Alert
              </h3>
              <button onClick={() => setShowTelegramModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mengirimkan format pesan darurat insiden Fiber Cut ke grup Telegram NOC Field Engineers.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] space-y-1 text-sky-300">
              <p>🚨 [FTTH NOC ALERT ENGINE]</p>
              <p>Event: FIBER CUT / KABEL UTAMA PUTUS</p>
              <p>Target ODP: {selectedPort?.odp_code || 'ODP-PDH-01'}</p>
              <p>Dampak: 14 Customer Off-Line (-32.5 dBm)</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowTelegramModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">Batal</button>
              <button onClick={handleSendTelegramAlert} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg shadow-sky-600/30">Kirim Telegram</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: 1-CLICK AUTO PROVISIONING ───────────────────────────────── */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleConfirmProvision} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> 1-Click Auto Provisioning ONU
              </h3>
              <button type="button" onClick={() => setShowProvisionModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Port GPON Target</label>
                <input readOnly value={selectedPort?.port_label || '1/1/1'} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Serial Number (SN)</label>
                <input value={provisionForm.sn} onChange={e => setProvisionForm({...provisionForm, sn: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 font-bold" />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Nama Pelanggan</label>
                <input value={provisionForm.customer_name} onChange={e => setProvisionForm({...provisionForm, customer_name: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Paket Bandwidth</label>
                <select value={provisionForm.speed_profile} onChange={e => setProvisionForm({...provisionForm, speed_profile: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                  <option value="PROFILE_10M">PROFILE_10M</option>
                  <option value="PROFILE_20M">PROFILE_20M</option>
                  <option value="PROFILE_50M">PROFILE_50M</option>
                  <option value="PROFILE_100M">PROFILE_100M</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">VLAN Service</label>
                <input type="number" value={provisionForm.vlan} onChange={e => setProvisionForm({...provisionForm, vlan: parseInt(e.target.value)})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-violet-400 font-bold" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">PPPoE Username</label>
                <input value={provisionForm.pppoe_user} onChange={e => setProvisionForm({...provisionForm, pppoe_user: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">PPPoE Password</label>
                <input value={provisionForm.pppoe_password} onChange={e => setProvisionForm({...provisionForm, pppoe_password: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowProvisionModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">Batal</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30">Jalankan Auto-Provisioning</button>
            </div>
          </form>
        </div>
      )}

      {/* ─── MODAL 4: GIS MAP INSPECTOR PREVIEW ───────────────────────────────── */}
      {showGisModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" /> GIS Map ODP Heatmap Preview
              </h3>
              <button onClick={() => setShowGisModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kode ODP:</span>
                  <span className="font-bold text-blue-400">{selectedPort?.odp_code || 'ODP-PDH-01/08'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lokasi Fisik:</span>
                  <span className="font-bold text-white">Jl. Raya Padaherang No. 45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Koordinat GIS:</span>
                  <span className="font-bold text-emerald-400">-7.6432, 108.6512</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tipe Splitter:</span>
                  <span className="font-bold text-amber-400">1:8 (7/8 Port Digunakan)</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowGisModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">Tutup</button>
              <Link href="/admin/olt/location" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5">
                Buka GIS Map Penuh <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: REBOOT ONT CONFIRMATION ──────────────────────────────────── */}
      {showRebootModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-amber-400" /> Reboot Modem ONT TR-069
              </h3>
              <button onClick={() => setShowRebootModal(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kirim sinyal restart TR-069 GenieACS ke ONT pelanggan <strong className="text-white">{showRebootModal.name}</strong> ({showRebootModal.sn})? Perangkat akan mere-start dalam 120 detik.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowRebootModal(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">Batal</button>
              <button onClick={handleConfirmReboot} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30">Jalankan Reboot</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
