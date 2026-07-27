'use client';
import { useState, useEffect } from 'react';

const initialOlt = [
  { id: 1, name: 'OLT ZTE C320 - Pusat', type: 'ZTE', host: '172.16.10.2', read: 'public', write: 'private' },
  { id: 2, name: 'OLT ZTE C300 - Barat', type: 'ZTE', host: '172.16.11.2', read: 'public', write: 'private' },
  { id: 3, name: 'OLT ZTE C320 - Timur', type: 'ZTE', host: '172.16.12.2', read: 'public', write: 'private' },
  { id: 4, name: 'OLT ZTE C350 - Utara', type: 'ZTE', host: '172.16.13.2', read: 'public', write: 'private' },
];

const initialVpn = [
  { id: 1, accountName: 'VPN OLT Pusat', username: 'vpn_olt_pusat', password: 'password123', ip: '10.8.2.10' },
  { id: 2, accountName: 'VPN OLT Barat', username: 'vpn_olt_barat', password: 'password456', ip: '10.8.2.11' },
  { id: 3, accountName: 'VPN OLT Timur', username: 'vpn_olt_timur', password: 'password789', ip: '10.8.2.12' },
];

export default function OltManagementPage() {
  const [loading, setLoading] = useState(true);

  // OLT State
  const [oltData] = useState(initialOlt);
  const [oltPage, setOltPage] = useState(1);
  const [oltRows, setOltRows] = useState(5);

  // VPN State
  const [vpnData] = useState(initialVpn);

  useEffect(() => setTimeout(() => setLoading(false), 500), []);

  if (loading) return <div style={{ color: '#94a3b8', animation: 'pulse 1.5s infinite' }}>Memuat OLT Management...</div>;

  return (
    <div className="fade-in-up" style={{ position: 'relative' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>OLT Management</h1>
          <select style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '6px', padding: '6px 12px', outline: 'none', cursor: 'pointer' }}>
            <option>All OLTs</option>
            <option>ZTE C320</option>
            <option>ZTE C300</option>
          </select>
        </div>
        <button style={{ padding: '10px 16px', background: '#007BFF', border: 'none', borderRadius: '6px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,123,255,0.3)' }}>
          <span>+</span> Add OLT
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* TABLE OLT */}
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Data OLT</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>No</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Host</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Read Community</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Write Community</th>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {oltData.slice(0, oltRows).map((olt, index) => (
                  <tr key={olt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{olt.name}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.type}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{olt.host}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.read}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{olt.write}</td>
                    <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#10b981' }} title="Edit">✏️</button>
                      <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>Rows per page:</span>
              <select 
                value={oltRows} 
                onChange={(e) => setOltRows(Number(e.target.value))}
                style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '4px', padding: '4px 8px', outline: 'none' }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
              1–{Math.min(oltRows, oltData.length)} of {oltData.length}
            </div>
          </div>
        </div>

        {/* GUIDE / REQUESTMENT PANEL */}
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>Guide</h2>
          <div style={{ color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Requestment</div>
          
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <li>Minimal Licence Radius Basic</li>
            <li>Create VPN Connection</li>
            <li>Read And Write</li>
            <li>Community SNMP</li>
            <li>ZTE C300, C320, C350 v.2.x / v.4.x</li>
            <li>Topology</li>
          </ul>

          <div style={{ marginTop: '24px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px', textAlign: 'center' }}>TOPOLOGI KONEKSI OLT</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>☁️</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Cloud</div>
              </div>
              <div style={{ flex: 1, height: '2px', background: '#8b5cf6', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 700 }}>VPN</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🖧</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>MikroTik</div>
              </div>
              <div style={{ flex: 1, height: '2px', background: '#8b5cf6', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: '#8b5cf6', textAlign: 'center' }}>Uplink &<br/>mgt1</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>📟</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>OLT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE VPN */}
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Data Account VPN (Untuk OLT)</h2>
          <button style={{ padding: '8px 16px', background: '#007BFF', border: 'none', borderRadius: '6px', color: 'white', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,123,255,0.3)' }}>
            <span>+</span> Add VPN
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>No</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Account Name</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Username</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Password</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>IP Address</th>
                <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {vpnData.map((vpn, index) => (
                <tr key={vpn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{index + 1}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{vpn.accountName}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{vpn.username}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}><span style={{ letterSpacing: '0.15em' }}>••••••••</span></td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{vpn.ip}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
