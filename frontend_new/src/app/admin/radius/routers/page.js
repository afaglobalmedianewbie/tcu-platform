'use client';
import { useState, useEffect } from 'react';

const initialRouters = [
  { id: 1, name: 'Router Pusat (MikroTik)', ip: '100.64.12.1', radiusIp: '172.16.0.5', secret: 'secret123', tz: '+07:00 Asia/Jakarta', snmp: true },
  { id: 2, name: 'Router Cabang Barat', ip: '100.64.12.5', radiusIp: '172.16.0.5', secret: 'rahasia456', tz: '+07:00 Asia/Jakarta', snmp: true },
];

export default function RadiusRoutersPage() {
  const [loading, setLoading] = useState(true);
  const [routers, setRouters] = useState(initialRouters);
  const [formData, setFormData] = useState({ name: '', ip: '', secret: '', tz: '+07:00 Asia/Jakarta' });
  const [scriptModal, setScriptModal] = useState({ isOpen: false, data: null });

  useEffect(() => setTimeout(() => setLoading(false), 400), []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip || !formData.secret) return;
    
    const newRouter = {
      id: Date.now(),
      name: formData.name,
      ip: formData.ip,
      radiusIp: '172.16.0.5', // Mock RADIUS IP
      secret: formData.secret,
      tz: formData.tz,
      snmp: false
    };
    setRouters([newRouter, ...routers]);
    setFormData({ name: '', ip: '', secret: '', tz: '+07:00 Asia/Jakarta' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Script berhasil di-copy!');
  };

  if (loading) return <div style={{ color: '#94a3b8', animation: 'pulse 1.5s infinite' }}>Memuat konfigurasi RADIUS NAS...</div>;

  return (
    <div className="fade-in-up" style={{ position: 'relative' }}>
      {/* HEADER & INFO BANNER */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>Radius Settings (NAS / Router)</h1>
        
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>💡</span>
          <div>
            <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>INFORMASI PENTING</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>Jika router MikroTik tidak memiliki Public IP, pastikan Anda <strong>buat akun VPN terlebih dahulu</strong> di menu VPN agar router bisa terhubung ke server RADIUS.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* PANEL KIRI: CREATE ACCOUNT NAS */}
        <div>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              Create Account NAS
            </h2>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Router Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Misal: Router Utama Area A"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>IP Address</label>
                <input 
                  type="text" 
                  value={formData.ip}
                  onChange={(e) => setFormData({...formData, ip: e.target.value})}
                  placeholder="IP Public / IP VPN"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Secret</label>
                <input 
                  type="password" 
                  value={formData.secret}
                  onChange={(e) => setFormData({...formData, secret: e.target.value})}
                  placeholder="RADIUS Secret Key"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Time Zone</label>
                <select 
                  value={formData.tz}
                  onChange={(e) => setFormData({...formData, tz: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none', appearance: 'none' }}
                >
                  <option value="+07:00 Asia/Jakarta">+07:00 Asia/Jakarta (WIB)</option>
                  <option value="+08:00 Asia/Makassar">+08:00 Asia/Makassar (WITA)</option>
                  <option value="+09:00 Asia/Jayapura">+09:00 Asia/Jayapura (WIT)</option>
                </select>
              </div>

              <button type="submit" style={{ marginTop: '8px', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* PANEL KANAN: DATA ROUTER NAS */}
        <div>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', height: '100%' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              Data Router NAS
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {routers.map(router => (
                <div key={router.id} style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* Info NAS */}
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>{router.name}</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 'x-24px y-8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ color: '#64748b', width: '70px' }}>IP Router:</span>
                        <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{router.ip}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', paddingLeft: '24px' }}>
                        <span style={{ color: '#64748b', width: '70px' }}>IP Radius:</span>
                        <span style={{ fontFamily: 'monospace' }}>{router.radiusIp}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ color: '#64748b', width: '70px' }}>Secret:</span>
                        <span>••••••••</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', paddingLeft: '24px' }}>
                        <span style={{ color: '#64748b', width: '70px' }}>Time Zone:</span>
                        <span>{router.tz}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>SNMP Status:</span>
                      {router.snmp ? (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}/> ONLINE</span>
                      ) : (
                        <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}/> OFFLINE</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#94a3b8' }} title="Edit">
                        ✏️
                      </button>
                      <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                        🗑️
                      </button>
                    </div>
                    <button 
                      onClick={() => setScriptModal({ isOpen: true, data: router })}
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>📜</span> View Script MikroTik
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL SCRIPT MIKROTIK */}
      {scriptModal.isOpen && scriptModal.data && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fade-in-up" style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <button 
              onClick={() => setScriptModal({ isOpen: false, data: null })}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              Script Mikrotik
            </h2>

            {/* TIPS PENGGUNAAN */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>TIPS PENGGUNAAN:</div>
              <ol style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.9rem', margin: 0 }}>
                <li>Copy semua script di bawah.</li>
                <li>Login ke MikroTik via Winbox, buka New Terminal, paste script, tekan Enter.</li>
                <li>Buka menu RADIUS, jika berhasil akan muncul server baru.</li>
                <li>Ubah Hotspot Server Profile di tab RADIUS, aktifkan Use RADIUS dan Accounting.</li>
              </ol>
            </div>

            {/* SCRIPT BLOCKS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* ROS 6 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Script Add New Radius Server MikroTik (RouterOS 6)</div>
                  <button onClick={() => copyToClipboard(`/radius add address=${scriptModal.data.radiusIp} secret=${scriptModal.data.secret} service=ppp,hotspot,login,dhcp timeout=300ms`)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                </div>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  /radius add address={scriptModal.data.radiusIp} secret={scriptModal.data.secret} service=ppp,hotspot,login,dhcp timeout=300ms
                </div>
              </div>

              {/* ROS 7 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Script Add New Radius Server MikroTik V7</div>
                  <button onClick={() => copyToClipboard(`/radius add address=${scriptModal.data.radiusIp} secret=${scriptModal.data.secret} service=ppp,hotspot,login,dhcp timeout=300ms\n/radius incoming set accept=yes port=3799`)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                </div>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre' }}>
                  {`/radius add address=${scriptModal.data.radiusIp} secret=${scriptModal.data.secret} service=ppp,hotspot,login,dhcp timeout=300ms\n/radius incoming set accept=yes port=3799`}
                </div>
              </div>

              {/* SNMP */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Script Enable SNMP MikroTik</div>
                  <button onClick={() => copyToClipboard(`/snmp set enabled=yes contact="NOC TCU" location="${scriptModal.data.name}" trap-version=2`)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Copy</button>
                </div>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  /snmp set enabled=yes contact="NOC TCU" location="{scriptModal.data.name}" trap-version=2
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
