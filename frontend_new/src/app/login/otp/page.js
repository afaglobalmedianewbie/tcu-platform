'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function OtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '500px',
        height: '500px',
        background: 'var(--gradient-glow)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '400px', padding: '40px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
            Verifikasi OTP
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Masukkan kode verifikasi yang telah kami kirimkan ke perangkat Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label" style={{ textAlign: 'left' }}>Kode OTP (4-6 digit)</label>
            <input
              type="text"
              maxLength={6}
              className="form-input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: 'bold' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk ⚡'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Tidak menerima kode? </span>
          <button 
            onClick={() => alert('Kode OTP baru telah dikirim kembali!')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            Kirim Ulang
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <Link href="/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
