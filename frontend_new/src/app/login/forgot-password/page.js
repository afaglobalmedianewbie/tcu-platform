'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, AlertCircle, CheckCircle2, ArrowRight, UserPlus } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notRegisteredError, setNotRegisteredError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock list of registered emails and phone numbers for verification check
  const registeredUsers = [
    'admin@topclassuniversal.co.id',
    'ceo@topclassuniversal.co.id',
    'teknisi@topclassuniversal.co.id',
    'support@topclassuniversal.co.id',
    '081234567890',
    '081299887766',
    '081311223344'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) return;

    setLoading(true);
    setNotRegisteredError(false);
    setSubmitted(false);

    try {
      // API call or database check for registered email/phone
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, fromSender: 'admin@topclassuniversal.co.id' })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmitted(true);
        } else if (data.message && data.message.includes('tidak terdaftar')) {
          setNotRegisteredError(true);
        } else {
          setSubmitted(true);
        }
      } else {
        // Fallback validation check
        const cleanInput = emailOrPhone.trim().toLowerCase();
        const isRegistered = registeredUsers.some(u => u.toLowerCase() === cleanInput || cleanInput.includes('topclassuniversal.co.id'));
        
        if (isRegistered) {
          setSubmitted(true);
        } else {
          setNotRegisteredError(true);
        }
      }
    } catch (err) {
      setNotRegisteredError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1120', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.05) 50%, transparent 100%)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{ width: '100%', maxWidth: '440px', padding: '36px', background: '#1e293b/80', backdropFilter: 'blur(16px)', border: '1px solid #334155', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '12px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(59,130,246,0.4)', backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(59,130,246,0.2)' }}>
              <Image
                src="/logo-tcu.jpg"
                alt="PT Top Class Universal"
                fill
                style={{ objectFit: 'cover' }}
                sizes="64px"
                priority
              />
            </div>
          </Link>
          <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2px', color: '#34d399', textTransform: 'uppercase', marginBottom: '8px' }}>
            PT TOP CLASS UNIVERSAL
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Pemulihan Kata Sandi
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
            Masukkan email atau No. HP/WhatsApp terdaftar untuk menerima petunjuk reset kata sandi.
          </p>
        </div>

        {/* Error: Unregistered Email or Phone */}
        {notRegisteredError && (
          <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem', margin: '0 0 6px 0' }}>Akun Belum Terdaftar!</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: '1.5', margin: 0 }}>
                  Email / No. WhatsApp <strong style={{ color: '#fff' }}>"{emailOrPhone}"</strong> belum pernah terdaftar di sistem TCU Platform. Pemberitahuan reset tidak dapat dikirim.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '10px' }}>
              <Link 
                href="/register" 
                style={{ width: '100%', padding: '10px 14px', background: '#7c3aed', color: '#fff', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <UserPlus size={16} /> Daftar Akun Baru Sekarang
              </Link>
            </div>
          </div>
        )}

        {/* Success: Reset Link Sent */}
        {submitted ? (
          <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <CheckCircle2 size={40} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem', marginBottom: '6px' }}>Tautan Reset Terkirim!</h3>
            <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              Petunjuk reset kata sandi telah dikirim <strong style={{ color: '#10b981' }}>OLEH admin@topclassuniversal.co.id</strong> ke <strong>{emailOrPhone}</strong>. Silakan cek Inbox atau WhatsApp Anda.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setEmailOrPhone('');
              }}
              style={{ marginTop: '20px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}
            >
              Coba Email / No. HP Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '8px' }}>
                Email atau No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                style={{ width: '100%', height: '48px', padding: '0 16px', background: '#0b1120', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                placeholder="nama@company.com atau 081234567890"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', height: '48px', background: 'linear-gradient(90deg, #7c3aed, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
              disabled={loading}
            >
              {loading ? 'Memeriksa Akun...' : 'Kirim Tautan Pemulihan ⚡'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
          <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>
            ← Kembali ke Login
          </Link>
          <Link href="/register" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 700 }}>
            Daftar Baru →
          </Link>
        </div>
      </div>
    </div>
  );
}
