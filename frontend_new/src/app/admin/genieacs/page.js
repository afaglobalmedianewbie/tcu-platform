'use client';
import { useState } from 'react';

export default function GenieACSDashboard() {
  const [activeTab, setActiveTab] = useState('devices');
  const [search, setSearch] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Mock data for ONTs connected to GenieACS
  const devices = [
    { id: 'ZTEGC1234567', manufacturer: 'ZTE', model: 'F660', software: 'V2.30.20P7T5s', ip: '10.10.10.22', pppoe: 'andi@topclassuniversal.co.id', status: 'Online', wifi: 'Andi_Family', last_inform: '2 menit yang lalu' },
    { id: 'HWTC88776655', manufacturer: 'Huawei', model: 'HG8245H', software: 'V3R015C10S103', ip: '10.10.10.45', pppoe: 'budi_cafe@topclassuniversal.co.id', status: 'Online', wifi: 'Cafe Budi', last_inform: '15 menit yang lalu' },
    { id: 'ZTEGCA96045B', manufacturer: 'ZTE', model: 'F609', software: 'V5.2.10P3T10', ip: '10.10.10.88', pppoe: 'diyar@topclassuniversal.co.id', status: 'Offline', wifi: 'DIYARSUGIARTI-ZIC', last_inform: '3 hari yang lalu' },
    { id: 'ALCL1A2B3C4D', manufacturer: 'Nokia', model: 'G-240W-F', software: '3FE47111AFIA42', ip: '10.10.10.102', pppoe: 'siti@topclassuniversal.co.id', status: 'Online', wifi: 'SitiNet', last_inform: 'Baru saja' },
  ];

  const filteredDevices = devices.filter(d => d.id.toLowerCase().includes(search.toLowerCase()) || d.pppoe.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='fade-in-up' style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' }}>
              📡
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>GenieACS Management</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>Kelola, monitor, dan perbarui perangkat ONT (Modem) dari jarak jauh via TR-069.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className='btn-secondary' style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>⬇ Unduh Laporan</button>
          <a href="http://acs.topclassuniversal.co.id:3000" target="_blank" className='btn-primary' style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Buka GenieACS Native ↗
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Total Perangkat', value: '1,452', icon: '📦', color: '#3b82f6' },
          { label: 'Online (24 Jam)', value: '1,390', icon: '🟢', color: '#10b981' },
          { label: 'Offline / Warning', value: '62', icon: '🔴', color: '#ef4444' },
          { label: 'Firmware Outdated', value: '184', icon: '⚠️', color: '#f59e0b' }
        ].map((stat, idx) => (
          <div key={idx} className='glass-panel' style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '2.5rem' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className='glass-panel' style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['devices', 'tasks', 'presets', 'provisioning'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '8px 16px', 
                  background: activeTab === tab ? 'rgba(59,130,246,0.1)' : 'transparent', 
                  color: activeTab === tab ? '#3b82f6' : '#94a3b8', 
                  border: activeTab === tab ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  borderRadius: '6px', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' 
                }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Cari Serial Number atau PPPoE..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 16px 8px 40px', width: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} 
            />
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Manufaktur / Model</th>
                <th>Akun PPPoE</th>
                <th>IP TR-069</th>
                <th>Nama WiFi (SSID)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map(device => (
                <tr key={device.id}>
                  <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{device.id}</td>
                  <td>
                    <div>{device.manufacturer}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{device.model} | {device.software}</div>
                  </td>
                  <td style={{ color: '#38bdf8' }}>{device.pppoe}</td>
                  <td style={{ fontFamily: 'monospace' }}>{device.ip}</td>
                  <td>{device.wifi}</td>
                  <td>
                    <span className={device.status === 'Online' ? 'badge badge-success' : 'badge badge-danger'}>
                      {device.status}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{device.last_inform}</div>
                  </td>
                  <td>
                    <button 
                      onClick={() => setSelectedDevice(device)}
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      Kelola ⚙️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Device Modal */}
      {selectedDevice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className='glass-panel fade-in-up' style={{ width: '800px', background: '#0f172a', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
                  Detail Perangkat: <span style={{ color: '#38bdf8' }}>{selectedDevice.id}</span>
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Berkomunikasi via protokol TR-069 (CWMP)</p>
              </div>
              <button onClick={() => setSelectedDevice(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Quick Actions */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Tindakan Cepat</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button className='btn-secondary' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔄</span> Reboot Modem
                  </button>
                  <button className='btn-secondary' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span> Factory Reset
                  </button>
                  <button className='btn-secondary' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📡</span> Refresh Parameter
                  </button>
                  <button className='btn-secondary' style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌐</span> Ping Test
                  </button>
                </div>
              </div>

              {/* Edit WiFi Settings */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Konfigurasi WLAN (WiFi)</h3>
                <div className='form-group'>
                  <label className='form-label' style={{ color: '#94a3b8' }}>Nama WiFi (SSID)</label>
                  <input type='text' defaultValue={selectedDevice.wifi} className='form-input' style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <div className='form-group' style={{ marginTop: '12px' }}>
                  <label className='form-label' style={{ color: '#94a3b8' }}>Password WiFi (KeyPassphrase)</label>
                  <input type='password' defaultValue="rahasia123" className='form-input' style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                </div>
                <button className='btn-primary' style={{ width: '100%', marginTop: '16px', padding: '10px', borderRadius: '8px' }}>Terapkan ke Modem (RPC)</button>
              </div>
            </div>

            {/* PPPoE Credentials */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Konfigurasi WAN / PPPoE</h3>
               <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className='form-label' style={{ color: '#94a3b8' }}>PPPoE Username</label>
                    <input type='text' defaultValue={selectedDevice.pppoe} className='form-input' style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }} disabled />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className='form-label' style={{ color: '#94a3b8' }}>PPPoE Password</label>
                    <input type='password' defaultValue="12345678" className='form-input' style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }} disabled />
                  </div>
               </div>
               <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '12px', margin: 0 }}>PPPoE dikelola secara otomatis oleh TCU Radius. Hubungi Admin jika perlu melakukan resync password.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
