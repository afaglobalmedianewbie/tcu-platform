'use client';
import { useState, useEffect } from 'react';

const stats = [
  { label: 'Managed Devices (CPE)', value: '3.420', icon: '📡', color: '#3b82f6' },
  { label: 'Online Devices', value: '3.150', icon: '🟢', color: '#10b981' },
  { label: 'Offline / Warning', value: '270', icon: '⚠️', color: '#f59e0b' },
  { label: 'Pending Provision', value: '14', icon: '⏳', color: '#8b5cf6' },
];

const devices = [
  { sn: 'ZTEG-8A9B2C11', oui: 'ZTE (0015EB)', ip: '10.10.10.45', firmware: 'V6.0.10P2T12', status: 'ONLINE', lastInform: 'Baru saja' },
  { sn: 'HWTC-44A5B322', oui: 'Huawei (00259E)', ip: '10.10.10.88', firmware: 'V3R015C10S108', status: 'ONLINE', lastInform: '2 mnt lalu' },
  { sn: 'ZTEG-8A9B2C99', oui: 'ZTE (0015EB)', ip: '-', firmware: 'V6.0.10P2T12', status: 'OFFLINE', lastInform: '12 jam lalu' },
  { sn: 'NOK-77B11C', oui: 'Nokia (200D11)', ip: '10.10.12.11', firmware: '3FE47111AFIA', status: 'ONLINE', lastInform: '15 mnt lalu' },
];

export default function AcsDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => setTimeout(() => setLoading(false), 500), []);

  if (loading) return <div style={{ color: '#94a3b8', animation: 'pulse 1.5s infinite' }}>Memuat data ACS...</div>;

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>ACS Server (TR-069)</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Sistem manajemen CPE / Modem FTTH terpusat untuk auto-provisioning dan monitoring jarak jauh.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Cari Perangkat
          </button>
          <button style={{ padding: '10px 16px', background: '#8b5cf6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
            <span>⚙️</span> Firmware Mass Update
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Daftar Perangkat (CPE)</h2>
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
            {devices.map((d, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>{d.sn}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{d.oui}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{d.ip}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{d.firmware}</td>
                <td style={{ padding: '16px' }}>
                  {d.status === 'ONLINE' ? (
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>ONLINE</span>
                  ) : (
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>OFFLINE</span>
                  )}
                </td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{d.lastInform}</td>
                <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button style={{ padding: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', color: '#10b981', cursor: 'pointer' }} title="Force Inform">🔄</button>
                  <button style={{ padding: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#f59e0b', cursor: 'pointer' }} title="Reboot CPE">🔌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
