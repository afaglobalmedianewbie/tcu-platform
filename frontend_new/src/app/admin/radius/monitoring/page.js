'use client';
import { useState, useEffect } from 'react';

// ONU Data (GPON ONU Monitoring)
const onuData = [
  { id: 'gpon-onu_0/1/1:1', interface: 'gpon-olt_0/1/1', name: 'DIYARSUGIARTI-ZIC-BRZ-RMS', type: 'ALL-ONT', sn: 'ZICGCA96045B', status: 'Online', power: '-21.3 dBm' },
  { id: 'gpon-onu_0/1/1:2', interface: 'gpon-olt_0/1/1', name: 'AGUS-SETIAWAN-HOME', type: 'ALL-ONT', sn: 'ZTEGCAB1234F', status: 'Offline', power: 'N/A' },
  { id: 'gpon-onu_0/1/1:3', interface: 'gpon-olt_0/1/1', name: 'PT-MAKMUR-JAYA', type: 'ALL-ONT', sn: 'HWTC4589ABC1', status: 'Low Signal', power: '-28.5 dBm' },
  { id: 'gpon-onu_0/1/2:1', interface: 'gpon-olt_0/1/2', name: 'KLINIK-SEHAT-SELALU', type: 'ALL-ONT', sn: 'ZICGCA77921D', status: 'Online', power: '-19.1 dBm' },
];

// OLT Data (Hardware)
const initialOlt = [
  { id: 1, name: 'OLT ZTE C320 - Pusat', type: 'ZTE', host: '172.16.10.2', read: 'public', write: 'private' },
  { id: 2, name: 'OLT ZTE C300 - Barat', type: 'ZTE', host: '172.16.11.2', read: 'public', write: 'private' },
  { id: 3, name: 'OLT ZTE C320 - Timur', type: 'ZTE', host: '172.16.12.2', read: 'public', write: 'private' },
  { id: 4, name: 'OLT ZTE C350 - Utara', type: 'ZTE', host: '172.16.13.2', read: 'public', write: 'private' },
];

// VPN OLT Data
const initialVpnOlt = [
  { id: 1, accountName: 'VPN OLT Pusat', username: 'vpn_olt_pusat', password: 'password123', ip: '10.8.2.10' },
  { id: 2, accountName: 'VPN OLT Barat', username: 'vpn_olt_barat', password: 'password456', ip: '10.8.2.11' },
  { id: 3, accountName: 'VPN OLT Timur', username: 'vpn_olt_timur', password: 'password789', ip: '10.8.2.12' },
];

// ACS Data (TR-069)
const acsStats = [
  { label: 'Managed Devices (CPE)', value: '3.420', icon: '📡', color: '#3b82f6' },
  { label: 'Online Devices', value: '3.150', icon: '🟢', color: '#10b981' },
  { label: 'Offline / Warning', value: '270', icon: '⚠️', color: '#f59e0b' },
  { label: 'Pending Provision', value: '14', icon: '⏳', color: '#8b5cf6' },
];

const acsDevices = [
  { sn: 'ZTEG-8A9B2C11', oui: 'ZTE (0015EB)', ip: '10.10.10.45', firmware: 'V6.0.10P2T12', status: 'ONLINE', lastInform: 'Baru saja' },
  { sn: 'HWTC-44A5B322', oui: 'Huawei (00259E)', ip: '10.10.10.88', firmware: 'V3R015C10S108', status: 'ONLINE', lastInform: '2 mnt lalu' },
  { sn: 'ZTEG-8A9B2C99', oui: 'ZTE (0015EB)', ip: '-', firmware: 'V6.0.10P2T12', status: 'OFFLINE', lastInform: '12 jam lalu' },
  { sn: 'NOK-77B11C', oui: 'Nokia (200D11)', ip: '10.10.12.11', firmware: '3FE47111AFIA', status: 'ONLINE', lastInform: '15 mnt lalu' },
];

export default function OltMonitoringPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('onu'); // 'onu' | 'olt' | 'vpn' | 'acs'
  
  // ONU states
  const [activeOnu, setActiveOnu] = useState(onuData[0].id);

  // OLT states
  const [oltData, setOltData] = useState(initialOlt);
  const [oltRows, setOltRows] = useState(5);

  // VPN states
  const [vpnData, setVpnData] = useState(initialVpnOlt);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <div style={{ animation: 'pulse 1.5s infinite', fontSize: '1.1rem' }}>Memuat modul infrastruktur...</div>
      </div>
    );
  }

  const copyScript = (acc) => {
    const script = `/ppp secret add name=${acc.username} password=${acc.password} profile=default-encryption local-address=10.8.2.1 remote-address=${acc.ip}`;
    navigator.clipboard.writeText(script);
    alert('Script VPN OLT berhasil di-copy!');
  };

  const TABS = [
    { key: 'onu', label: '📊 ONU Monitoring' },
    { key: 'olt', label: '📟 OLT Devices / HW' },
    { key: 'vpn', label: '🔑 VPN OLT Accounts' },
    { key: 'acs', label: '🔌 ACS / TR-069 CPEs' },
  ];

  return (
    <div className="fade-in-up" style={{ position: 'relative' }}>
      
      {/* TABS HEADER */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center', marginRight: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigasi:</span>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '6px 14px', background: activeTab === tab.key ? 'rgba(59,130,246,0.25)' : 'transparent',
            border: `1px solid ${activeTab === tab.key ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px', color: activeTab === tab.key ? '#93c5fd' : '#94a3b8',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* HEADER SECTION */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            {activeTab === 'onu' && 'OLT Monitoring & ONU Status'}
            {activeTab === 'olt' && 'OLT Devices (Optical Line Terminal)'}
            {activeTab === 'vpn' && 'VPN Accounts for OLT Interconnection'}
            {activeTab === 'acs' && 'ACS Server (TR-069) CPE Management'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {activeTab === 'onu' && 'Pemantauan real-time status ONU/ONT dan sinyal fiber optik.'}
            {activeTab === 'olt' && 'Manajemen perangkat hardware OLT di berbagai Network Sites.'}
            {activeTab === 'vpn' && 'VPN Tunnel khusus untuk menghubungkan OLT di lapangan ke RADIUS server.'}
            {activeTab === 'acs' && 'Sistem manajemen CPE / Modem FTTH terpusat untuk auto-provisioning dan monitoring.'}
          </p>
        </div>
        {activeTab === 'olt' && (
          <button style={{ padding: '10px 16px', background: '#007BFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            ＋ Add OLT Device
          </button>
        )}
        {activeTab === 'vpn' && (
          <button style={{ padding: '10px 16px', background: '#007BFF', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            ＋ Add VPN Account
          </button>
        )}
      </div>

      {/* ─── TAB 1: ONU MONITORING ──────────────────────────────── */}
      {activeTab === 'onu' && (
        <>
          {/* 4 Status Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(59,130,246,0.3)', borderTop: '4px solid #3b82f6', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Waiting Auth</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>0</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Epon: <span style={{ color: '#e2e8f0' }}>0</span> | Gpon: <span style={{ color: '#e2e8f0' }}>0</span></div>
            </div>
            <div style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(16,185,129,0.3)', borderTop: '4px solid #10b981', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Online</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '8px' }}>898</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Auth: <span style={{ color: '#e2e8f0' }}>964</span></div>
            </div>
            <div style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(239,68,68,0.3)', borderTop: '4px solid #ef4444', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Offline</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>66</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PwrFail: <span style={{ color: '#e2e8f0' }}>54</span> | LoS: <span style={{ color: '#e2e8f0' }}>5</span></div>
            </div>
            <div style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(245,158,11,0.3)', borderTop: '4px solid #f59e0b', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Low Signals</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', marginBottom: '8px' }}>517</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Warn: <span style={{ color: '#e2e8f0' }}>446</span> | Crit: <span style={{ color: '#e2e8f0' }}>71</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button style={{ padding: '10px 16px', background: '#007BFF', border: 'none', borderRadius: '6px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              ➕ Add Unauthenticated
            </button>
            <select style={{ padding: '10px 16px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
              <option value="">Profile Configuration</option>
              <option value="tcont">T-CONT</option>
              <option value="gem">GEM-Port</option>
              <option value="wanvlan">WAN Vlan</option>
            </select>
            <button style={{ padding: '10px 16px', background: '#10b981', border: 'none', borderRadius: '6px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              💾 SaveCfg
            </button>
          </div>

          {/* ONU list table */}
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '30px' }}></th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Onu ID</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>SN / MAC</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Power Rx OLT</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {onuData.map((onu) => (
                  <tr key={onu.id} onClick={() => setActiveOnu(onu.id)} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: activeOnu === onu.id ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: onu.status === 'Online' ? '#10b981' : onu.status === 'Offline' ? '#ef4444' : '#f59e0b' }} />
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>{onu.id}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{onu.name}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{onu.type}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{onu.sn}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>{onu.power}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${onu.status === 'Online' ? 'badge-success' : onu.status === 'Offline' ? 'badge-danger' : 'badge-warning'}`}>{onu.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ONU Detail Panel */}
          <div style={{ marginTop: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '16px', borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '8px' }}>Detailed ONU Information</h3>
            {onuData.filter(o => o.id === activeOnu).map(detail => (
              <div key={detail.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Interface</div>
                  <div style={{ color: '#f8fafc', fontSize: '0.9rem', fontFamily: 'monospace' }}>{detail.interface}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>ONU ID</div>
                  <div style={{ color: '#f8fafc', fontSize: '0.9rem', fontFamily: 'monospace' }}>{detail.id}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Name</div>
                  <div style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600 }}>{detail.name}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>SN / MAC</div>
                  <div style={{ color: '#38bdf8', fontSize: '0.9rem', fontFamily: 'monospace' }}>{detail.sn}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>ONU Type</div>
                  <div style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{detail.type}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                  <div style={{ color: detail.status === 'Online' ? '#10b981' : detail.status === 'Offline' ? '#ef4444' : '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>{detail.status}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── TAB 2: OLT DEVICES ─────────────────────────────────── */}
      {activeTab === 'olt' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* OLT Table */}
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Data Perangkat OLT</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                <thead>
                  <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>No</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Host Address</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Read Comm.</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Write Comm.</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {oltData.slice(0, oltRows).map((olt, index) => (
                    <tr key={olt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{olt.name}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.type}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{olt.host}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.read}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.write}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#10b981' }}>✏️</button>
                          <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guide Panel */}
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '16px' }}>Panduan OLT</h2>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Minimal Lisensi RADIUS Basic aktif.</li>
              <li>Pastikan OLT terhubung ke tunnel VPN OLT.</li>
              <li>SNMP Read Community default: <strong>public</strong>.</li>
              <li>SNMP Write Community default: <strong>private</strong>.</li>
              <li>Kompatibel: ZTE C300, C320, C350 (v2.x / v4.x).</li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── TAB 3: VPN OLT ACCOUNTS ────────────────────────────── */}
      {activeTab === 'vpn' && (
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Akun VPN (Khusus Perangkat OLT / Switch)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>No</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Nama Perangkat / Site</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Username VPN</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Password VPN</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Alokasi IP Address</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Script Mikrotik</th>
                </tr>
              </thead>
              <tbody>
                {vpnData.map((vpn, index) => (
                  <tr key={vpn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{vpn.accountName}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{vpn.username}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}><span style={{ letterSpacing: '0.15em' }}>••••••••</span></td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{vpn.ip}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button onClick={() => copyScript(vpn)} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                        Copy Script
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4: ACS SERVER (TR-069) ─────────────────────────── */}
      {activeTab === 'acs' && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {acsStats.map((s, i) => (
              <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* CPE Device List */}
          <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Daftar Perangkat Pelanggan (CPE Modem)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Serial Number</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Vendor (OUI)</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>IP Address</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Firmware</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Last Inform</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {acsDevices.map((d, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>{d.sn}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{d.oui}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{d.ip}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{d.firmware}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${d.status === 'ONLINE' ? 'badge-success' : 'badge-danger'}`}>{d.status}</span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{d.lastInform}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', color: '#10b981', cursor: 'pointer' }} title="Force Inform">🔄</button>
                        <button style={{ padding: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#f59e0b', cursor: 'pointer' }} title="Reboot CPE">🔌</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}
