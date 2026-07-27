'use client';
import { useState, useEffect } from 'react';

// ─── Input Component ────────────────────────────────────────────────────────
function FormInput({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
          color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ title, children, actions }) {
  return (
    <div style={{
      background: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9'
      }}>
        {title}
      </div>
      <div style={{ padding: '20px', flex: 1 }}>
        {children}
      </div>
      {actions && (
        <div style={{
          padding: '16px 20px', background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end'
        }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState({ full_name: 'Super Admin', email: 'admin@topclassuniversal.co.id', username: '', phone: '', address: '', profile_picture: null, preferences: { timeout: 5 } });
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', username: '', phone: '', email: '', address: '' });

  // Password State
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  
  // Timeout State
  const [timeoutVal, setTimeoutVal] = useState(5);

  // 2FA Setup State
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const handleGenerate2FA = async () => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.qrCode);
        setSecretKey(data.secret || '');
        setIsSettingUp2FA(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal membuat request 2FA');
    }
  };

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    }
  };

  const handleVerify2FA = async () => {
    if (!totpCode) return alert('Masukkan kode 2FA');
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: totpCode })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, twoFactorEnabled: true, needs2FASetup: false });
        const localUser = JSON.parse(localStorage.getItem('tcu_user') || '{}');
        localUser.twoFactorEnabled = true;
        localUser.needs2FASetup = false;
        localStorage.setItem('tcu_user', JSON.stringify(localUser));
        setIsSettingUp2FA(false);
        setTotpCode('');
        alert('2FA berhasil diaktifkan!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal memverifikasi kode 2FA');
    }
  };

  const handleDisable2FA = async () => {
    if (!totpCode) return alert('Masukkan kode 2FA untuk verifikasi penonaktifan');
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: totpCode })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, twoFactorEnabled: false, needs2FASetup: true });
        const localUser = JSON.parse(localStorage.getItem('tcu_user') || '{}');
        localUser.twoFactorEnabled = false;
        localUser.needs2FASetup = true;
        localStorage.setItem('tcu_user', JSON.stringify(localUser));
        setIsDisabling2FA(false);
        setTotpCode('');
        alert('2FA berhasil dinonaktifkan.');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menonaktifkan 2FA');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tcu_token');
    if (!token) { setLoading(false); return; }

    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUser(data.user);
        setProfileData({
          full_name: data.user.full_name || '',
          username: data.user.username || '',
          phone: data.user.phone || '',
          email: data.user.email || '',
          address: data.user.address || ''
        });
        if (data.user.loginLogs) setLoginLogs(data.user.loginLogs);
        if (data.user.preferences?.timeout) setTimeoutVal(data.user.preferences.timeout);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, ...profileData });
        
        // Update local storage session
        const localUser = JSON.parse(localStorage.getItem('tcu_user') || '{}');
        const updatedUser = { ...localUser, ...profileData };
        localStorage.setItem('tcu_user', JSON.stringify(updatedUser));
        
        setIsEditingProfile(false);
        alert('Profil berhasil diperbarui!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal memperbarui profil.');
    }
  };

  const Button = ({ label, primary, danger, onClick }) => {
    let bg = 'rgba(255,255,255,0.05)';
    let color = '#cbd5e1';
    let hoverBg = 'rgba(255,255,255,0.1)';
    
    if (primary) {
      bg = '#3b82f6';
      color = '#ffffff';
      hoverBg = '#2563eb';
    } else if (danger) {
      bg = '#ef4444';
      color = '#ffffff';
      hoverBg = '#dc2626';
    }

    return (
      <button
        onClick={onClick}
        style={{
          background: bg, color, padding: '8px 16px', borderRadius: '8px',
          border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px'
        }}
        onMouseEnter={e => e.currentTarget.style.background = hoverBg}
        onMouseLeave={e => e.currentTarget.style.background = bg}
      >
        {label}
      </button>
    );
  };

  const handleUpdatePhoto = async () => {
    const newUrl = prompt('Masukkan URL foto profil baru (misal: https://example.com/photo.jpg):', user.profile_picture || '');
    if (newUrl !== null) {
      const token = localStorage.getItem('tcu_token');
      try {
        const res = await fetch('/api/auth/profile-picture', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ profile_picture: newUrl })
        });
        const data = await res.json();
        if (data.success) {
          setUser({ ...user, profile_picture: newUrl });
          alert('Foto profil berhasil diperbarui!');
        } else {
          alert('Gagal: ' + data.message);
        }
      } catch (err) {
        alert('Gagal menyimpan foto.');
      }
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert('Konfirmasi password baru tidak cocok!');
    }
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert('Password berhasil diubah!');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal mengubah password');
    }
  };

  const handleSavePreferences = async () => {
    const token = localStorage.getItem('tcu_token');
    const newPrefs = { ...user.preferences, timeout: parseInt(timeoutVal, 10) };
    try {
      const res = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ preferences: newPrefs })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, preferences: newPrefs });
        alert('Sesi dan tampilan berhasil disimpan!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menyimpan preferensi');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '2rem' }}>👤</div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Profil Saya</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Manajemen akun dan preferensi pribadi Top Class Universal</p>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#94a3b8' }}>Memuat profil...</div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Profile */}
        <SectionCard 
          title="Profil Pribadi" 
          actions={
            isEditingProfile ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button label="Batalkan" onClick={() => { setIsEditingProfile(false); setProfileData({ full_name: user.full_name, username: user.username, phone: user.phone, email: user.email, address: user.address }); }} />
                <Button label="Simpan Profil" primary onClick={handleSaveProfile} />
              </div>
            ) : (
              <Button label="Ubah Profil" primary onClick={() => setIsEditingProfile(true)} />
            )
          }
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 8px 16px rgba(59,130,246,0.3)', overflow: 'hidden'
              }}>
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user.full_name || 'SA').slice(0,2).toUpperCase()
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button onClick={handleUpdatePhoto} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Ganti Foto</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <FormInput label="Nama Lengkap" value={profileData.full_name} readOnly={!isEditingProfile} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} />
              <FormInput label="Username" value={profileData.username} readOnly={!isEditingProfile} onChange={(e) => setProfileData({...profileData, username: e.target.value})} />
              <FormInput label="No Telepon" value={profileData.phone} readOnly={!isEditingProfile} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
              <FormInput label="Email" type="email" value={profileData.email} readOnly={!isEditingProfile} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Alamat Lengkap</label>
                <textarea 
                  value={profileData.address || ''} 
                  disabled={!isEditingProfile} 
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                  rows="3"
                  style={{
                    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                    color: !isEditingProfile ? '#64748b' : '#e2e8f0', fontSize: '0.9rem', outline: 'none',
                    resize: 'vertical', cursor: !isEditingProfile ? 'not-allowed' : 'text'
                  }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Last Login Log */}
        <SectionCard title="Riwayat Login Terakhir">
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Tanggal & Waktu</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {loginLogs.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Belum ada riwayat.</td>
                  </tr>
                ) : (
                  loginLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{new Date(log.created_at).toLocaleString('id-ID')}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{log.ip_address || 'Unknown'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Webmail & Mail Sync Flow */}
        <SectionCard title="Sinkronisasi Akun Webmail">
          <div style={{ padding: '16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akun Terkoneksi</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>{user.email}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '9999px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>AKTIF SINKRON</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Alur Jaringan Surat (Webmail Pipeline):</span>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
                  <div style={{ color: '#cbd5e1' }}><strong>Profil Admin:</strong> Identitas email utama ({user.email}) diatur di dashboard.</div>
                </div>
                <div style={{ borderLeft: '2px dashed rgba(59,130,246,0.4)', height: '16px', marginLeft: '12px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
                  <div style={{ color: '#cbd5e1' }}><strong>Sinkronisasi Dovecot:</strong> Sistem menyinkronkan data alias & hash MD5-Crypt ke MySQL Mail DB.</div>
                </div>
                <div style={{ borderLeft: '2px dashed rgba(59,130,246,0.4)', height: '16px', marginLeft: '12px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</div>
                  <div style={{ color: '#cbd5e1' }}><strong>Klien Webmail:</strong> Pengguna dapat langsung menggunakan akun di sistem Webmail.</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Change Password */}
        <SectionCard title="Ganti Password" actions={<Button label="Ganti Password" primary onClick={handleChangePassword} />}>
          <FormInput label="Old Password" type="password" placeholder="Masukkan password lama" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} />
          <FormInput label="New Password" type="password" placeholder="Password baru" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
          <FormInput label="Confirm New Password" type="password" placeholder="Ulangi password baru" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
        </SectionCard>

        {/* Two-Factor Authentication */}
        <SectionCard title="Two-Factor Authentication (2FA)">
          {user.twoFactorEnabled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Status Keamanan</div>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    Aktif (Sangat Aman)
                  </div>
                </div>
                {!isDisabling2FA && (
                  <Button label="Nonaktifkan 2FA" danger onClick={() => setIsDisabling2FA(true)} />
                )}
              </div>
              
              {isDisabling2FA && (
                <div style={{ padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FormInput label="Masukkan Kode 2FA 6-Digit untuk Menonaktifkan" placeholder="000000" value={totpCode} onChange={e => setTotpCode(e.target.value)} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <Button label="Batalkan" onClick={() => { setIsDisabling2FA(false); setTotpCode(''); }} />
                    <Button label="Konfirmasi Nonaktifkan" danger onClick={handleDisable2FA} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Status Keamanan</div>
                  <div style={{ fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                    Belum Aktif (Rentan)
                  </div>
                </div>
                {!isSettingUp2FA && (
                  <Button label="Aktifkan 2FA" primary onClick={handleGenerate2FA} />
                )}
              </div>

              {isSettingUp2FA && (
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '4px', textAlign: 'center', fontWeight: 600 }}>Langkah 1: Scan QR Code ini di aplikasi Google Authenticator / Authy</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px', textAlign: 'center' }}>Tidak bisa scan? Gunakan kode rahasia manual di bawah.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <img src={qrCode} alt="2FA QR Code" style={{ border: '8px solid white', borderRadius: '8px', maxWidth: '200px' }} />
                  </div>
                  {secretKey && (
                    <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>🔑 KUNCI RAHASIA MANUAL (Jika tidak bisa scan QR):</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <code style={{
                          flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px',
                          color: '#60a5fa', fontSize: '0.88rem', letterSpacing: '0.1em',
                          wordBreak: 'break-all', fontFamily: 'monospace'
                        }}>
                          {secretKey}
                        </code>
                        <button
                          onClick={handleCopySecret}
                          style={{
                            padding: '8px 14px', background: keyCopied ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                            border: `1px solid ${keyCopied ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
                            borderRadius: '6px', color: keyCopied ? '#10b981' : '#3b82f6',
                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                          }}
                        >
                          {keyCopied ? '✓ Tersalin' : '📋 Salin'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
                        Masukkan kunci ini secara manual di aplikasi authenticator Anda dengan memilih opsi "Enter a setup key".
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Langkah 2: Masukkan kode 6 digit dari aplikasi authenticator Anda:</p>
                  <FormInput label="" placeholder="Kode 6 digit (contoh: 123456)" value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0,6))} />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <Button label="Batalkan" onClick={() => { setIsSettingUp2FA(false); setTotpCode(''); setSecretKey(''); }} />
                    <Button label="Verifikasi & Aktifkan" primary onClick={handleVerify2FA} />
                  </div>
                </div>
              )}
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '16px', lineHeight: 1.6 }}>
            Autentikasi dua langkah (2FA) menambah lapisan keamanan ekstra ke akun Anda dengan mensyaratkan kode verifikasi setiap kali Anda login.
          </p>
        </SectionCard>

        {/* Timeout & Reset */}
        <SectionCard title="Sesi & Tampilan">
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              Auto Logout Timeout (Menit)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="number" value={timeoutVal} onChange={(e) => setTimeoutVal(e.target.value)} min="1" style={{
                width: '100px', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                color: '#e2e8f0', fontSize: '0.9rem', outline: 'none'
              }} />
              <Button label="Save Timeout" primary onClick={handleSavePreferences} />
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>Reset Columns</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Kembalikan tata letak tabel ke bawaan sistem.</div>
              </div>
              <Button label="Reset Columns" danger onClick={() => alert('Kolom dikembalikan ke default')} />
            </div>
          </div>
        </SectionCard>

        {/* Support Signature */}
        <SectionCard title="Support Signature" actions={<Button label="Save Signature" primary />}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
            Tanda Tangan Tiket Balasan
          </label>
          <textarea
            placeholder="Tuliskan signature Anda di sini..."
            rows="5"
            defaultValue="--\nRegards,\nTCU Support Team"
            style={{
              width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
              color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', resize: 'vertical'
            }}
          />
        </SectionCard>

        {/* Canned Groups */}
        <SectionCard title="Canned Groups" actions={<Button label="＋ Add Group" primary />}>
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Title</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
                    Belum ada Canned Groups
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button label="🗑️ Delete Selected" danger />
          </div>
        </SectionCard>

      </div>
      )}
    </div>
  );
}
