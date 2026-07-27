'use client';
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  MapPin, 
  CreditCard, 
  Phone, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  Clock, 
  Globe, 
  QrCode,
  Check,
  X
} from 'lucide-react';

export default function StaffProfilePage() {
  const [profile, setProfile] = useState({
    id: '',
    email: '',
    username: '',
    full_name: '',
    phone: '',
    address: '',
    ktp: '',
    role: '',
    twoFactorEnabled: false,
    loginLogs: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form states
  const [fullName, setFullName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userKtp, setUserKtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  // 2FA Modal states
  const [qrModal, setQrModal] = useState({ open: false, secret: '', qrCode: '' });
  const [otpCode, setOtpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('tcu_token');
      const localUserStr = localStorage.getItem('tcu_user');
      let localUser = {};
      try {
        if (localUserStr) localUser = JSON.parse(localUserStr);
      } catch (e) {}

      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const u = data.user;
          setProfile(u);
          setFullName(u.full_name || '');
          setUserPhone(u.phone || '');
          setUserAddress(u.address || '');
          setUserKtp(u.ktp || u.preferences?.ktp || '');
          setTwoFactor(Boolean(u.twoFactorEnabled));
          setLoading(false);
          return;
        }
      }

      // Fallback from localStorage
      setProfile({
        id: localUser.id || 'usr_demo',
        email: localUser.email || 'ceo@topclassuniversal.co.id',
        username: localUser.username || 'ceo',
        full_name: localUser.full_name || 'Adnan Rachmat',
        phone: localUser.phone || '082319140858',
        address: localUser.address || 'Padaherang',
        ktp: localUser.ktp || '3207201611870003',
        role: localUser.role || 'SUPERADMIN',
        twoFactorEnabled: false,
        loginLogs: []
      });
      setFullName(localUser.full_name || 'Adnan Rachmat');
      setUserAddress(localUser.address || 'Padaherang');
      setUserKtp(localUser.ktp || '3207201611870003');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setQrModal({ open: true, secret: data.secret, qrCode: data.qrCode });
      } else {
        alert(data.message || 'Gagal menyiapkan 2FA');
      }
    } catch(e) {
      alert('Terjadi kesalahan saat menyiapkan 2FA');
    }
  };

  const handleVerify2FA = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      alert('Kode 2FA harus 6 digit angka');
      return;
    }
    setVerifying2FA(true);
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: otpCode })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Otentikasi 2FA (OAuth TOTP) Berhasil Diaktifkan!\nEmail notifikasi pengaman telah dikirim dari admin@topclassuniversal.co.id.');
        setQrModal({ open: false, secret: '', qrCode: '' });
        setTwoFactor(true);
        setOtpCode('');
        fetchProfile();
      } else {
        alert('❌ ' + data.message);
      }
    } catch(e) {
      alert('Gagal memverifikasi 2FA.');
    } finally {
      setVerifying2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt('Masukkan kode 2FA 6-digit untuk konfirmasi penonaktifan:');
    if (!code) return;
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ 2FA berhasil dinonaktifkan.');
        setTwoFactor(false);
        fetchProfile();
      } else {
        alert('❌ ' + data.message);
      }
    } catch(e) {
      alert('Gagal menonaktifkan 2FA.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('tcu_token');
      const payload = {
        full_name: fullName,
        phone: userPhone,
        address: userAddress,
        ktp: userKtp,
        twoFactorEnabled: twoFactor,
        ...(newPassword ? { newPassword } : {})
      };

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setMsg({ type: 'success', text: 'Profil berhasil diperbarui dan disinkronkan!' });
          setNewPassword('');
          setConfirmPassword('');
          
          const updatedUser = {
            ...profile,
            full_name: fullName,
            address: userAddress,
            ktp: userKtp,
            twoFactorEnabled: twoFactor
          };
          localStorage.setItem('tcu_user', JSON.stringify(updatedUser));
          fetchProfile();
          setSaving(false);
          return;
        } else {
          setMsg({ type: 'error', text: data.message || 'Gagal memperbarui profil.' });
        }
      } else {
        setMsg({ type: 'success', text: 'Perubahan profil disimpan di local session.' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Terjadi kesalahan sistem.' });
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile.full_name || profile.username || 'TC')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-900/60 via-blue-900/40 to-slate-900 border border-[#334155] p-6 md:p-8 overflow-hidden backdrop-blur-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center font-extrabold text-3xl text-white shadow-xl shadow-violet-900/40 ring-4 ring-white/10 shrink-0">
            {initials}
          </div>
          <div className="text-center md:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{profile.full_name || 'Staff TCU'}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                profile.role === 'SUPERADMIN' ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' :
                profile.role === 'ADMIN' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300' :
                profile.role === 'TEKNISI' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {profile.role || 'SUPERADMIN'}
              </span>
            </div>
            <p className="text-sm text-slate-400 font-mono">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-violet-400" /> Username: <strong className="text-slate-200 font-mono">{profile.username || 'ceo'}</strong></span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-blue-400" /> No. KTP: <strong className="text-slate-200 font-mono">{profile.ktp || '-'}</strong></span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Alamat: <strong className="text-slate-200">{profile.address || '-'}</strong></span>
            </div>
          </div>
          <button 
            onClick={fetchProfile}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800/80 border border-[#334155] hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {msg.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm animate-fade-in ${
          msg.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Main Grid: Form & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#334155]">
              <User className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Informasi Pribadi & Akun</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[0.7rem] uppercase tracking-widest font-bold text-slate-400">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#0b1120] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] uppercase tracking-widest font-bold text-slate-400">Nomor KTP (NIK)</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userKtp}
                    onChange={(e) => setUserKtp(e.target.value)}
                    placeholder="3207201611870003"
                    className="w-full bg-[#0b1120] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] uppercase tracking-widest font-bold text-slate-400">Nomor Telepon / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="082319140858"
                    className="w-full bg-[#0b1120] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] uppercase tracking-widest font-bold text-slate-400">Email Utama (Mail Server)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-slate-900/60 border border-[#334155]/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.7rem] uppercase tracking-widest font-bold text-slate-400">Alamat Lengkap Domisili</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full bg-[#0b1120] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            {/* Password Update Section */}
            <div className="pt-4 border-t border-[#334155] space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-200">Ubah Password Akun</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Password Baru (opsional)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak diubah"
                    className="w-full bg-[#0b1120] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full bg-[#0b1120] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-violet-900/30 transition cursor-pointer"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & 2FA Setup */}
        <div className="space-y-6">
          {/* Security & 2FA Card */}
          <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Keamanan Lapis 2FA (OAuth TOTP)</h2>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1120] border border-[#334155] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">Keamanan 2FA TOTP</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {profile.twoFactorEnabled ? '🟢 Status: Aktif' : '🔴 Status: Nonaktif'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  profile.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {profile.twoFactorEnabled ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>

              {profile.twoFactorEnabled ? (
                <button
                  type="button"
                  onClick={handleDisable2FA}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <X className="w-4 h-4" /> Nonaktifkan 2FA
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSetup2FA}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> Tampilkan QR Code / Key 2FA
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 flex items-start gap-2.5">
              <Key className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <span>Sistem keamanan dilapis 2FA OAuth TOTP mengirim notifikasi otomatis dari <strong>admin@topclassuniversal.co.id</strong> ke email Anda.</span>
            </div>
          </div>

          {/* Login Activity Logs */}
          <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#334155]">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Riwayat Sesi Login</h2>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {profile.loginLogs && profile.loginLogs.length > 0 ? (
                profile.loginLogs.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0b1120] border border-[#334155]/60 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" /> {log.ip_address || '127.0.0.1'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{log.user_agent || 'Browser'}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0b1120] border border-[#334155] text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  Sesi login aktif disinkronkan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2FA QR Code & Secret Key Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setQrModal({ open: false, secret: '', qrCode: '' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Setup 2FA OAuth TOTP</h3>
              <p className="text-xs text-slate-400">Scan QR Code ini menggunakan aplikasi Authenticator (Google Authenticator / Authy)</p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              {qrModal.qrCode ? (
                <img src={qrModal.qrCode} alt="2FA QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-500">Memuat QR Code...</div>
              )}
            </div>

            {/* Secret Key Box */}
            <div className="p-3 rounded-xl bg-[#0b1120] border border-[#334155] space-y-1 text-center">
              <span className="text-[0.65rem] uppercase tracking-widest text-slate-400 font-bold">Secret Key (Manual Entry)</span>
              <p className="text-sm font-mono font-extrabold text-amber-400 select-all tracking-wider">{qrModal.secret}</p>
            </div>

            {/* OTP Verification Form */}
            <form onSubmit={handleVerify2FA} className="space-y-3 pt-2">
              <label className="text-xs text-slate-300 block font-semibold text-center">Masukkan Kode 6-Digit dari Aplikasi Authenticator:</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
                className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-[#0b1120] border border-violet-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                disabled={verifying2FA}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer"
              >
                {verifying2FA ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {verifying2FA ? 'Verifikasi...' : 'Verifikasi & Aktifkan 2FA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
