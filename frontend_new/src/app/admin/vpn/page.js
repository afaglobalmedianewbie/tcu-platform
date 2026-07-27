'use client';
import { useState, useEffect } from 'react';

export default function VpnDashboard() {
  const [loading, setLoading] = useState(true);
  const [isDocOpen, setDocOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  
  // Sesuai request: default tabel kosong
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({ name: '', user: '', password: '' });
  
  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => setTimeout(() => setLoading(false), 500), []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.user || !formData.password) return;
    
    const newAcc = {
      id: Date.now(),
      name: formData.name,
      username: formData.user,
      password: formData.password,
      ip: `10.8.1.${Math.floor(Math.random() * 200) + 20}`
    };
    
    setAccounts([newAcc, ...accounts]);
    setFormData({ name: '', user: '', password: '' });
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(search.toLowerCase()) || 
    acc.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const copyScript = (acc) => {
    const script = `/ppp secret add name=${acc.username} password=${acc.password} profile=default-encryption local-address=10.8.1.1 remote-address=${acc.ip}`;
    navigator.clipboard.writeText(script);
    alert('Script berhasil di-copy!');
  };

  if (loading) return <div style={{ color: '#94a3b8', animation: 'pulse 1.5s infinite' }}>Memuat data VPN...</div>;

  return (
    <div className="fade-in-up" style={{ position: 'relative' }}>
      
      {/* HEADER & INFO BANNER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>VPN Account</h1>
          <button 
            onClick={() => setDocOpen(true)}
            style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#f59e0b', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>📄</span> Dokumentasi Script
          </button>
        </div>
        
        {/* PANEL INFO */}
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem', marginTop: '2px' }}>💡</span>
          <div>
            <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>INFO PENTING</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Fungsi VPN adalah untuk menghubungkan <strong>MikroTik Router</strong> ke server <strong>TCU Platform</strong> melalui jaringan publik.<br/>
              Radius server tidak dapat meneruskan paket jika router tidak memiliki Public IP atau tidak berada di jaringan yang sama.<br/>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Instruksi tambahan:</span> Jika MikroTik tidak memiliki Public IP, silakan buat akun VPN gratis di sini tanpa biaya tambahan.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* PANEL KIRI: CREATE ACCOUNT VPN */}
        <div>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              Create Account VPN
            </h2>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Account Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Misal: Router Cabang 1"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>User</label>
                <input 
                  type="text" 
                  value={formData.user}
                  onChange={(e) => setFormData({...formData, user: e.target.value})}
                  placeholder="Username VPN"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Password VPN"
                    style={{ width: '100%', padding: '10px 40px 10px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} 
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
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
            
            {/* Header Data Panel & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Data Account VPN</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem', marginRight: '6px' }}>🔍</span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari akun..." 
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '0.85rem', width: '180px' }} 
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                <thead>
                  <tr style={{ background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', width: '40px' }}>#</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Username</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Password</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>IP Address</th>
                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Script Mikrotik</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAccounts.map((acc, index) => (
                    <tr key={acc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{acc.name}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>{acc.username}</td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        <span style={{ letterSpacing: '0.15em' }}>••••••••</span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>{acc.ip}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button onClick={() => copyScript(acc)} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                          Copy Script
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedAccounts.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                        Tidak ada data VPN. Silakan buat akun VPN baru di form kiri.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER / PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Rows per page:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '4px', padding: '4px 8px', outline: 'none' }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#e2e8f0' }}>
                <span>
                  {filteredAccounts.length === 0 ? '0-0 of 0' : `${((currentPage - 1) * rowsPerPage) + 1}-${Math.min(currentPage * rowsPerPage, filteredAccounts.length)} of ${filteredAccounts.length}`}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: currentPage === 1 ? '#475569' : '#e2e8f0', borderRadius: '4px', padding: '6px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    &lt;
                  </button>
                  <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(c => c + 1)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: (currentPage === totalPages || totalPages === 0) ? '#475569' : '#e2e8f0', borderRadius: '4px', padding: '6px 10px', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* POPUP DOCUMENTATION MODAL */}
      {isDocOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fade-in-up" style={{ width: '600px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <button 
              onClick={() => setDocOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📄</span> Cara Menggunakan Script MikroTik
            </h2>

            <ol style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Pilih mode VPN yang ingin digunakan: <strong>PPTP</strong>, <strong>L2TP</strong>, atau <strong>SSTP</strong>.</li>
              <li style={{ marginBottom: '8px' }}>Copy seluruh script dengan menekan tombol <strong>Copy Script</strong> pada tabel.</li>
              <li style={{ marginBottom: '8px' }}>Login MikroTik via <strong>Winbox</strong> &rarr; <strong>New Terminal</strong>.</li>
              <li style={{ marginBottom: '8px' }}>Paste script &rarr; tekan <strong>Enter</strong>.</li>
              <li style={{ marginBottom: '8px' }}>Cek interface VPN di menu <strong>PPP &rarr; Interface</strong>.</li>
              <li style={{ marginBottom: '8px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>Catatan:</span> Jika tidak connect, coba mode lain (beberapa ISP memblokir PPTP/L2TP).
              </li>
            </ol>
            
          </div>
        </div>
      )}

    </div>
  );
}
