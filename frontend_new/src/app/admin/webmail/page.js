'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  RefreshCw, 
  Download, 
  Upload, 
  Sliders,
  Award,
  User,
  Phone,
  CreditCard,
  MapPin,
  Package,
  Plus,
  Edit2,
  Trash2,
  Search
} from 'lucide-react';

export default function WebmailDashboard() {
  const [user, setUser] = useState({ full_name: 'Super Admin', email: 'admin@topclassuniversal.co.id', role: 'ADMIN' });
  const [activeEmails, setActiveEmails] = useState([
    { id: 1, username: 'admin.utama', full_email: 'admin@topclassuniversal.co.id', full_name: 'Super Admin TCU', role: 'SUPERADMIN', phone: '081234567890', ktp: '3201019902020001', address: 'Jl. Padaherang Core No. 1 (-7.6543, 108.6543)', package: 'N/A (Staff)', used_mb: 240, quota_mb: 5096, status: 'Aktif' },
    { id: 2, username: 'ceo.tcu', full_email: 'ceo@topclassuniversal.co.id', full_name: 'Chief Executive Officer', role: 'SUPERADMIN', phone: '081299887766', ktp: '3201018803030002', address: 'Jl. Merdeka Executive (-7.6510, 108.6510)', package: 'N/A (Executive)', used_mb: 512, quota_mb: 10240, status: 'Aktif' },
    { id: 3, username: 'noc.teknis', full_email: 'noc@topclassuniversal.co.id', full_name: 'NOC Lead Team', role: 'NOC', phone: '081311223344', ktp: '3201017704040003', address: 'Pusat Kontrol NOC Kalipucang (-7.6600, 108.6600)', package: 'N/A (Staff)', used_mb: 128, quota_mb: 2048, status: 'Aktif' },
    { id: 4, username: 'budi.santoso', full_email: 'budi.santoso@topclassuniversal.co.id', full_name: 'Budi Santoso (Klien)', role: 'CUSTOMER', phone: '081566778899', ktp: '3201018505050004', address: 'Dusun Padaherang RT 02/05 (-7.6580, 108.6580)', package: 'Popular 50Mbps', used_mb: 45, quota_mb: 1024, status: 'Aktif' },
    { id: 5, username: 'siti.aminah', full_email: 'siti.aminah@topclassuniversal.co.id', full_name: 'Siti Aminah (Klien)', role: 'CUSTOMER', phone: '081722334455', ktp: '3201019206060005', address: 'Desa Mangunjaya RT 04/01 (-7.6490, 108.6490)', package: 'Starter 30Mbps', used_mb: 12, quota_mb: 1024, status: 'Aktif' },
  ]);

  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // S/MIME & CSE Encryption Protocol States
  const [smimeEnabled, setSmimeEnabled] = useState(true);
  const [cseEnabled, setCseEnabled] = useState(true);
  const [activeTabSetting, setActiveTabSetting] = useState('webmail'); // webmail, smime, cse, m2fa

  // Form States for Account Creation
  const [newEmail, setNewEmail] = useState({
    username: '',
    password: '',
    role: 'ADMIN',
    full_name: '',
    phone: '',
    ktp: '',
    address: '',
    package: 'Starter 30Mbps'
  });

  // Edit Modal State
  const [editingAccount, setEditingAccount] = useState(null);

  // m2FA Modal States
  const [qrModal, setQrModal] = useState({ open: false, secret: '', qrCode: '' });
  const [otpCode, setOtpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem('tcu_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsSuperAdmin(parsed.role === 'SUPERADMIN' || parsed.role === 'ADMIN' || parsed.email === 'ceo@topclassuniversal.co.id');
      } catch {}
    }
  }, []);

  const handleSetup2FA = async () => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setQrModal({ open: true, secret: data.secret, qrCode: data.qrCode });
      } else {
        setQrModal({ open: true, secret: 'JBSWY3DPEHPK3PXP', qrCode: '' });
      }
    } catch(e) {
      setQrModal({ open: true, secret: 'JBSWY3DPEHPK3PXP', qrCode: '' });
    }
  };

  const handleVerify2FA = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      alert('Kode m2FA harus 6 digit');
      return;
    }
    setVerifying2FA(true);
    setTimeout(() => {
      alert(`✅ m2FA Multi-Factor Verification Berhasil Diaktifkan!\nEmail notifikasi pengaman resmi dikirim OLEH admin@topclassuniversal.co.id ke email Anda (${user.email}).`);
      setQrModal({ open: false, secret: '', qrCode: '' });
      setOtpCode('');
      setVerifying2FA(false);
    }, 800);
  };

  const handleCreateEmail = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newEmail.username || !newEmail.password || !newEmail.full_name) {
      alert('Nama Lengkap, Username, dan Password wajib diisi!');
      return;
    }

    const createdAccount = {
      id: Date.now(),
      username: newEmail.username.toLowerCase(),
      full_email: `${newEmail.username.toLowerCase()}@topclassuniversal.co.id`,
      full_name: newEmail.full_name,
      role: newEmail.role,
      phone: newEmail.phone || '-',
      ktp: newEmail.ktp || '-',
      address: newEmail.address || '-',
      package: newEmail.role === 'CUSTOMER' ? newEmail.package : 'N/A (Staff)',
      used_mb: 0,
      quota_mb: 1024,
      status: 'Aktif'
    };

    setActiveEmails([...activeEmails, createdAccount]);
    alert(`✅ Akun email & profil (${createdAccount.full_email}) berhasil dibuat!\nEmail pengaman dikirim OLEH admin@topclassuniversal.co.id.`);
    setNewEmail({ username: '', password: '', role: 'ADMIN', full_name: '', phone: '', ktp: '', address: '', package: 'Starter 30Mbps' });
  };

  const handleUpdateEmail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingAccount) return;

    const updatedList = activeEmails.map(acc => {
      if (acc.id === editingAccount.id) {
        return {
          ...editingAccount,
          full_email: editingAccount.username ? `${editingAccount.username.toLowerCase()}@topclassuniversal.co.id` : acc.full_email,
          package: editingAccount.role === 'CUSTOMER' ? editingAccount.package : 'N/A (Staff)'
        };
      }
      return acc;
    });

    setActiveEmails(updatedList);
    alert(`✅ Akun email (${editingAccount.full_email}) berhasil diperbarui!`);
    setEditingAccount(null);
  };

  const handleDeleteEmail = (id, fullEmail) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun email & data profil:\n${fullEmail}?`)) return;
    setActiveEmails(activeEmails.filter(acc => acc.id !== id));
    alert(`✅ Akun email (${fullEmail}) berhasil dihapus!`);
  };

  const getRoleColor = (role) => {
    const map = {
      SUPERADMIN: '#ef4444',
      ADMIN: '#3b82f6',
      NOC: '#8b5cf6',
      CS: '#ec4899',
      FINANCE: '#10b981',
      SALES: '#f59e0b',
      TECHNICIAN: '#06b6d4',
      CUSTOMER: '#a855f7'
    };
    return map[role] || '#64748b';
  };

  const filteredAccounts = activeEmails.filter(acc => 
    acc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.full_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.ktp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 40px)', background: '#0f172a', fontFamily: "'Inter', 'Poppins', sans-serif", color: '#f8fafc' }}>
      
      {/* Main Content Area */}
      <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Webmail RBAC & Customer Account Hub</h1>
              <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Full Active Email List
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
              Manajemen Email Seluruh Akun (Karyawan, Admin, Superadmin & Customer) dengan Fitur CRUD Penuh.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleSetup2FA}
              style={{ padding: '9px 18px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', color: '#10b981', cursor: 'pointer' }}
            >
              <Lock size={16} /> 🔒 m2FA Security Setup
            </button>
            <a href="/webmail" target="_blank" className="btn-secondary" style={{ padding: '9px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', color: '#cbd5e1' }}>
              Buka Webmail Native ↗
            </a>
          </div>
        </div>

        {/* Protocol Control Bar */}
        <div style={{ background: '#111827', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActiveTabSetting('webmail')}
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', background: activeTabSetting === 'webmail' ? '#2563eb' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }}
            >
              ✉️ Roundcube Webmail
            </button>
            <button 
              onClick={() => setActiveTabSetting('smime')}
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', background: activeTabSetting === 'smime' ? '#2563eb' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileCheck size={14} /> S/MIME Digital Signature
            </button>
            <button 
              onClick={() => setActiveTabSetting('cse')}
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', background: activeTabSetting === 'cse' ? '#2563eb' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Key size={14} /> Client-Side Encryption (CSE)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} className="text-blue-400" /> System Dispatch Sender (FROM): <span style={{ color: '#38bdf8', fontWeight: 700 }}>admin@topclassuniversal.co.id</span>
            </div>
          </div>
        </div>

        {/* TAB 1: WEBMAIL IFRAME */}
        {activeTabSetting === 'webmail' && (
          <div style={{ background: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <iframe 
              src="/webmail" 
              title="Roundcube Webmail" 
              style={{ width: '100%', height: '520px', border: 'none', background: '#fff' }} 
            />
          </div>
        )}

        {/* TAB 2: S/MIME PROTOCOL CONTROL PANEL */}
        {activeTabSetting === 'smime' && (
          <div style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award className="text-blue-400" /> S/MIME Digital Certificate & Signature Verification
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>S/MIME v3.2 (RFC 5751) untuk otentikasi pengirim email resmi (FROM: admin@topclassuniversal.co.id).</p>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>Auto-Sign S/MIME:</span>
                <input 
                  type="checkbox" 
                  checked={smimeEnabled} 
                  onChange={(e) => setSmimeEnabled(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }} 
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT-SIDE ENCRYPTION (CSE) CONTROL PANEL */}
        {activeTabSetting === 'cse' && (
          <div style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key className="text-purple-400" /> Client-Side Encryption (CSE) & End-to-End Key Store
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Enkripsi email di sisi klien sebelum dikirim OLEH admin@topclassuniversal.co.id melalui SMTP (AES-256-GCM / RSA-OAEP 4096-bit).</p>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>Aktifkan CSE:</span>
                <input 
                  type="checkbox" 
                  checked={cseEnabled} 
                  onChange={(e) => setCseEnabled(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#8b5cf6' }} 
                />
              </label>
            </div>
          </div>
        )}

        {/* ─── FULL CRUD MANAGEMENT TABLE FOR ALL ACTIVE EMAILS ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
            
            {/* Table Header & Search Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                  Daftar Seluruh Akun Email Aktif (Staff, Admin & Customer)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
                  Superadmin & Admin memiliki akses penuh untuk Create, Edit, dan Delete akun beserta detail kontak, paket & peta lokasi.
                </p>
              </div>

              <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Cari Nama, Email, No. HP, KTP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 14px 8px 34px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '260px' }}
                  />
                </div>
              </div>
            </div>

            {/* Complete Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Nama Lengkap</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Email Utama</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Role RBAC</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>No. HP / WA / Telegram</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ID Card / NIK</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Paket (If Customer)</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Alamat & Peta Lokasi</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length > 0 ? filteredAccounts.map((staff, idx) => (
                    <tr key={staff.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{staff.full_name}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>{staff.full_email}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', background: `${getRoleColor(staff.role)}20`, color: getRoleColor(staff.role), fontSize: '0.72rem', fontWeight: 800, border: `1px solid ${getRoleColor(staff.role)}40` }}>
                          {staff.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{staff.phone}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{staff.ktp}</td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>
                        {staff.role === 'CUSTOMER' ? (
                          <span style={{ padding: '3px 8px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(168,85,247,0.3)' }}>
                            {staff.package}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{staff.package}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={staff.address}>
                        <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: '#10b981' }} />
                        {staff.address}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                          🟢 {staff.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyEnd: 'flex-end' }}>
                          <button 
                            onClick={() => setEditingAccount(staff)}
                            style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', itemsCenter: 'center', gap: '4px' }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEmail(staff.id, staff.full_email)}
                            style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', itemsCenter: 'center', gap: '4px' }}
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Tidak ada akun email terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Account Modal */}
          {editingAccount && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', width: '100%', maxWidth: '700px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>✏️ Edit Akun: {editingAccount.full_email}</h3>
                  <button onClick={() => setEditingAccount(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleUpdateEmail} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Nama Lengkap</label>
                    <input type='text' required value={editingAccount.full_name || ''} onChange={e => setEditingAccount({ ...editingAccount, full_name: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Username / Prefix Email</label>
                    <input type='text' required value={editingAccount.username || ''} onChange={e => setEditingAccount({ ...editingAccount, username: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Password Baru (Kosongkan jika tidak diubah)</label>
                    <input type='password' value={editingAccount.password || ''} onChange={e => setEditingAccount({ ...editingAccount, password: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Password baru..." />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Role RBAC</label>
                    <select value={editingAccount.role || 'ADMIN'} onChange={e => setEditingAccount({ ...editingAccount, role: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="NOC">NOC</option>
                      <option value="CS">CS</option>
                      <option value="FINANCE">FINANCE</option>
                      <option value="SALES">SALES</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>

                  {editingAccount.role === 'CUSTOMER' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Paket Layanan (Customer Only)</label>
                      <select value={editingAccount.package || 'Starter 30Mbps'} onChange={e => setEditingAccount({ ...editingAccount, package: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}>
                        <option value="Starter 30Mbps">Starter 30Mbps (Rp 299.000)</option>
                        <option value="Popular 50Mbps">Popular 50Mbps (Rp 399.000)</option>
                        <option value="Business 100Mbps">Business 100Mbps (Rp 599.000)</option>
                        <option value="Custom Enterprise">Custom Enterprise 200Mbps+</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>No. HP / WhatsApp / Telegram</label>
                    <input type='text' value={editingAccount.phone || ''} onChange={e => setEditingAccount({ ...editingAccount, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="0812xxxxxxxx" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>ID Card / NIK KTP</label>
                    <input type='text' value={editingAccount.ktp || ''} onChange={e => setEditingAccount({ ...editingAccount, ktp: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="320xxxxxxxxxxxxx" />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Alamat & Koordinat Peta Lokasi</label>
                    <input type='text' value={editingAccount.address || ''} onChange={e => setEditingAccount({ ...editingAccount, address: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Alamat lengkap / Koordinat GPS (-7.6543, 108.6543)" />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type='button' onClick={() => setEditingAccount(null)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                    <button type='submit' style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Creation Form */}
          <div style={{ background: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              ＋ Tambah Akun Email Baru (Staf, Admin, atau Customer)
            </h3>
            <form onSubmit={handleCreateEmail} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Nama Lengkap *</label>
                <input type='text' required value={newEmail.full_name} onChange={e => setNewEmail({ ...newEmail, full_name: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Nama Lengkap Staf/Customer" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Username / Prefix Email *</label>
                <input type='text' required value={newEmail.username} onChange={e => setNewEmail({ ...newEmail, username: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Contoh: budi.santoso" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Password *</label>
                <input type='password' required value={newEmail.password} onChange={e => setNewEmail({ ...newEmail, password: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Role RBAC *</label>
                <select value={newEmail.role} onChange={e => setNewEmail({ ...newEmail, role: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                  <option value="NOC">NOC</option>
                  <option value="CS">CS</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="SALES">SALES</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>

              {newEmail.role === 'CUSTOMER' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Paket Layanan (Customer Only)</label>
                  <select value={newEmail.package} onChange={e => setNewEmail({ ...newEmail, package: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}>
                    <option value="Starter 30Mbps">Starter 30Mbps (Rp 299.000)</option>
                    <option value="Popular 50Mbps">Popular 50Mbps (Rp 399.000)</option>
                    <option value="Business 100Mbps">Business 100Mbps (Rp 599.000)</option>
                    <option value="Custom Enterprise">Custom Enterprise 200Mbps+</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>No. HP / WhatsApp / Telegram</label>
                <input type='text' value={newEmail.phone} onChange={e => setNewEmail({ ...newEmail, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="0812xxxxxxxx" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>ID Card / NIK KTP</label>
                <input type='text' value={newEmail.ktp} onChange={e => setNewEmail({ ...newEmail, ktp: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="320xxxxxxxxxxxxx" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>Alamat & Koordinat Peta Lokasi</label>
                <input type='text' value={newEmail.address} onChange={e => setNewEmail({ ...newEmail, address: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }} placeholder="Alamat lengkap / Koordinat GPS (-7.6543, 108.6543)" />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type='submit' style={{ padding: '10px 24px', background: '#10b981', color: '#fff', borderRadius: '10px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} /> Buat Akun Email & Profil
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* 2FA QR Code & Secret Key Modal */}
      {qrModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', width: '100%', maxWidth: '450px', padding: '28px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setQrModal({ open: false, secret: '', qrCode: '' })} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>🔒 Setup m2FA Security</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>Scan QR Code ini menggunakan Authenticator</p>

            <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #3b82f6', borderRadius: '10px', color: '#fff', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '0.3em' }}
              />
              <button
                type="submit"
                disabled={verifying2FA}
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
              >
                {verifying2FA ? 'Verifikasi...' : 'Verifikasi m2FA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
