'use client';
import { useState, useEffect, useCallback } from 'react';

export default function RadiusDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [nasDevices, setNasDevices] = useState([]);
  const [stats, setStats] = useState({ total_subscribers: 0, active: 0, isolated: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'nas' | 'vpn'
  const [showNasModal, setShowNasModal] = useState(false);
  const [editNas, setEditNas] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nasForm, setNasForm] = useState({ router_name: '', ip_address: '', secret: '', timezone: 'Asia/Jakarta', snmp_community: '' });

  // VPN Server States
  const [vpnAccounts, setVpnAccounts] = useState([]);
  const [vpnFormData, setVpnFormData] = useState({ name: '', user: '', password: '' });
  const [vpnSearch, setVpnSearch] = useState('');
  const [vpnShowPassword, setVpnShowPassword] = useState(false);

  const SUB_PAGES = [
    { label: '📡 RADIUS / Sesi', tab: 'sessions' },
    { label: '🚀 PPP Router & Backup (Bitmix)', tab: 'mikrotik_sync' },
    { label: '🌐 NAS / Routers', tab: 'nas' },
    { label: '🔐 VPN Server (WireGuard)', tab: 'vpn' },
  ];


  const token = typeof window !== 'undefined' ? localStorage.getItem('tcu_token') : '';

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/radius/stats', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  }, [token]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${search}` : '';
      const res = await fetch(`/api/admin/radius/accounts${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAccounts(data.accounts);
    } catch {}
    setLoading(false);
  }, [search, token]);

  const fetchNas = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/radius/nas', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setNasDevices(data.devices);
    } catch {}
  }, [token]);

  useEffect(() => { fetchStats(); fetchAccounts(); fetchNas(); }, [fetchStats, fetchAccounts, fetchNas]);

  const openAddNas = () => {
    setEditNas(null);
    setNasForm({ router_name: '', ip_address: '', secret: '', timezone: 'Asia/Jakarta', snmp_community: '' });
    setShowNasModal(true);
  };

  const openEditNas = (d) => {
    setEditNas(d);
    setNasForm({ router_name: d.router_name, ip_address: d.ip_address, secret: d.secret, timezone: d.timezone, snmp_community: d.snmp_community || '' });
    setShowNasModal(true);
  };

  const saveNas = async () => {
    setSaving(true);
    try {
      const url = editNas ? `/api/admin/radius/nas/${editNas.id}` : '/api/admin/radius/nas';
      const method = editNas ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(nasForm) });
      const data = await res.json();
      if (data.success) { setShowNasModal(false); fetchNas(); }
      else alert(data.message);
    } catch {}
    setSaving(false);
  };

  const deleteNas = async (id) => {
    if (!confirm('Hapus NAS device ini?')) return;
    await fetch(`/api/admin/radius/nas/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchNas();
  };

  const handleCreateVpn = (e) => {
    e.preventDefault();
    if (!vpnFormData.name || !vpnFormData.user || !vpnFormData.password) return;
    
    const newAcc = {
      id: Date.now(),
      name: vpnFormData.name,
      username: vpnFormData.user,
      password: vpnFormData.password,
      ip: `10.8.1.${Math.floor(Math.random() * 200) + 20}`
    };
    
    setVpnAccounts([newAcc, ...vpnAccounts]);
    setVpnFormData({ name: '', user: '', password: '' });
  };

  const copyVpnScript = (acc) => {
    const script = `/ppp secret add name=${acc.username} password=${acc.password} profile=default-encryption local-address=10.8.1.1 remote-address=${acc.ip}`;
    navigator.clipboard.writeText(script);
    alert('Script berhasil di-copy!');
  };

  const STAT_CARDS = [
    { label: 'Total Subscribers', value: stats.total_subscribers, icon: '👥', color: '#3b82f6' },
    { label: 'Active Sessions', value: stats.active, icon: '🟢', color: '#10b981' },
    { label: 'Terisolir', value: stats.isolated, icon: '🔒', color: '#ef4444' },
    { label: 'NAS Devices', value: nasDevices.length, icon: '📡', color: '#8b5cf6' },
  ];

  return (
    <div className="fade-in-up">
      {/* Sub-navigation bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center', marginRight: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigasi:</span>
        {SUB_PAGES.map(sp => (
          <button key={sp.label} onClick={() => setActiveTab(sp.tab)} style={{
            padding: '6px 14px', background: activeTab === sp.tab ? 'rgba(59,130,246,0.25)' : 'transparent',
            border: `1px solid ${activeTab === sp.tab ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '6px', color: activeTab === sp.tab ? '#93c5fd' : '#94a3b8',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}>{sp.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {activeTab === 'sessions' ? 'RADIUS Accounts & Sessions' : activeTab === 'nas' ? 'NAS Devices & Routers' : 'VPN Server (WireGuard)'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            {activeTab === 'sessions' && 'Pusat Autentikasi (AAA) untuk pelanggan PPPoE dan Hotspot.'}
            {activeTab === 'nas' && 'Manajemen perangkat Router MikroTik NAS penyedia layanan.'}
            {activeTab === 'vpn' && 'Menghubungkan MikroTik Router ke server portal via VPN Tunnel.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab === 'nas' && (
            <button onClick={openAddNas} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
              <span>➕</span> Tambah Router NAS
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* RADIUS Accounts Tab */}
      {activeTab === 'sessions' && (
        <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>PPPoE / Hotspot Accounts</h2>
            <input className="form-input" placeholder="🔍 Cari username..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '240px' }} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Username', 'Profile / Paket', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Memuat data RADIUS...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Belum ada akun RADIUS. Daftarkan pelanggan terlebih dahulu.</td></tr>
              ) : accounts.map((acc) => (
                <tr key={acc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600 }}>{acc.username}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{acc.profile}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700,
                      background: acc.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: acc.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                    }}>{acc.status === 'ACTIVE' ? '🟢 Active' : '🔒 Isolated'}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>
                      {acc.status === 'ACTIVE' ? 'Isolir' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NAS Devices Tab */}
      {activeTab === 'nas' && (
        <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Daftar Router / NAS Devices</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Router Name', 'IP Address', 'Secret', 'Timezone', 'SNMP Community', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nasDevices.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  Belum ada NAS device. <button onClick={openAddNas} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Tambah Router →</button>
                </td></tr>
              ) : nasDevices.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#e2e8f0' }}>{d.router_name}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: '#38bdf8' }}>{d.ip_address}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.8rem' }}>{d.secret.replace(/./g, '•')}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{d.timezone}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{d.snmp_community || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditNas(d)} style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteNas(d.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* VPN Server Tab */}
      {activeTab === 'vpn' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* PANEL KIRI: CREATE ACCOUNT VPN */}
          <div>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                Create Account VPN
              </h2>
              <form onSubmit={handleCreateVpn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Account Name</label>
                  <input type="text" value={vpnFormData.name} onChange={e => setVpnFormData({...vpnFormData, name: e.target.value})} placeholder="Misal: Router Cabang 1" style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>User</label>
                  <input type="text" value={vpnFormData.user} onChange={e => setVpnFormData({...vpnFormData, user: e.target.value})} placeholder="Username VPN" style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={vpnShowPassword ? "text" : "password"} value={vpnFormData.password} onChange={e => setVpnFormData({...vpnFormData, password: e.target.value})} placeholder="Password VPN" style={{ width: '100%', padding: '10px 40px 10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} required />
                    <button type="button" onClick={() => setVpnShowPassword(!vpnShowPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                      {vpnShowPassword ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </div>
                <button type="submit" style={{ marginTop: '8px', padding: '12px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(0,123,255,0.3)' }}>
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* PANEL KANAN: DATA ACCOUNT VPN */}
          <div>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Data Account VPN</h2>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', marginRight: '6px' }}>🔍</span>
                  <input type="text" value={vpnSearch} onChange={e => setVpnSearch(e.target.value)} placeholder="Cari akun..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '0.85rem', width: '150px' }} />
                </div>
              </div>
              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>#</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Username</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>IP Address</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Script Mikrotik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vpnAccounts.filter(acc => acc.name.toLowerCase().includes(vpnSearch.toLowerCase()) || acc.username.toLowerCase().includes(vpnSearch.toLowerCase())).map((acc, index) => (
                      <tr key={acc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{acc.name}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{acc.username}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{acc.ip}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button onClick={() => copyVpnScript(acc)} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                            Copy Script
                          </button>
                        </td>
                      </tr>
                    ))}
                    {vpnAccounts.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                          Tidak ada data VPN. Silakan buat akun VPN baru di form kiri.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAS Modal */}
      {showNasModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9' }}>
              {editNas ? 'Edit NAS Device' : 'Tambah Router / NAS'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Router Name *', key: 'router_name', placeholder: 'MikroTik-Pusat' },
                { label: 'IP Address *', key: 'ip_address', placeholder: '192.168.1.1' },
                { label: 'RADIUS Secret *', key: 'secret', placeholder: 'radius_secret_key' },
                { label: 'SNMP Community', key: 'snmp_community', placeholder: 'public' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>{f.label}</label>
                  <input type="text" className="form-input" placeholder={f.placeholder} value={nasForm[f.key]} onChange={e => setNasForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Timezone</label>
                <select className="form-input" value={nasForm.timezone} onChange={e => setNasForm(p => ({ ...p, timezone: e.target.value }))} style={{ width: '100%' }}>
                  <option value="Asia/Jakarta">+7 Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">+8 Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">+9 Asia/Jayapura (WIT)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowNasModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Batal</button>
              <button onClick={saveNas} disabled={saving} className="btn-primary" style={{ padding: '10px 32px' }}>
                {saving ? 'Menyimpan...' : (editNas ? 'Simpan Perubahan' : 'Tambah NAS')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
