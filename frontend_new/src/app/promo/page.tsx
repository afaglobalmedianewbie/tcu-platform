'use client';

import React, { useState } from 'react';
import { Ticket, Percent, Clock, Calendar, ChevronRight, Check } from 'lucide-react';

interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: string;
}

const initialPromos: Promo[] = [
  {
    id: '1',
    code: 'TCUMERDEKA',
    title: 'Promo Merdeka Ciamis & Banjar',
    description: 'Diskon biaya pemasangan instalasi 50% untuk wilayah Ciamis & Banjar.',
    discount: '50% OFF Instalasi',
    validUntil: '31 Aug 2026',
    category: 'Instalasi'
  },
  {
    id: '2',
    code: 'TCUBNDLSTREAM',
    title: 'Promo Bundling Digital Service',
    description: 'Gratis akses streaming hiburan selama 3 bulan untuk pelanggan baru paket Premium.',
    discount: '3 Bulan Gratis Streaming',
    validUntil: '15 Sep 2026',
    category: 'Add-on'
  },
  {
    id: '3',
    code: 'TCUGIGALITE',
    title: 'Promo Giga Lite Upgrade',
    description: 'Dapatkan peningkatan kecepatan gratis sebesar 10 Mbps selama 2 bulan pertama.',
    discount: 'Free Speed Upgrade',
    validUntil: '30 Sep 2026',
    category: 'Paket'
  }
];

export default function PromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [validationResult, setValidationResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const matchedPromo = initialPromos.find(
      (p) => p.code.toLowerCase() === promoCode.trim().toLowerCase()
    );

    if (matchedPromo) {
      setValidationResult({
        status: 'success',
        message: `Selamat! Kode promo ${matchedPromo.code} valid. Anda berhak mendapatkan "${matchedPromo.discount}".`
      });
    } else {
      setValidationResult({
        status: 'error',
        message: `Maaf, kode promo "${promoCode}" tidak ditemukan atau sudah kedaluwarsa.`
      });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '80px 24px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-in-up">
            <span className="badge badge-info" style={{ marginBottom: '16px' }}>Penawaran Terbatas</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Promo & Voucher<br />
              <span style={{ color: 'var(--primary)' }}>Top Class Universal</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Nikmati penawaran spesial dan voucher diskon menarik dari kami untuk berlangganan internet super cepat dan stabil.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }} className="grid-dashboard-main">
            
            {/* Left: Active Promo List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Daftar Promo Aktif</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {initialPromos.map((promo) => (
                  <div 
                    key={promo.id} 
                    className="glass-panel" 
                    style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}
                  >
                    {/* Glowing effect inside card */}
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '120px', height: '120px', background: 'rgba(37,99,235,0.06)', borderRadius: '50%', filter: 'blur(30px)' }} />
                    
                    <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: 'var(--primary)' }}>
                      <Percent className="w-6 h-6" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge badge-info">{promo.category}</span>
                        <span className="badge badge-success" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{promo.code}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{promo.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '16px' }}>{promo.description}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock className="w-4 h-4" />
                          <span>Berlaku s/d: <strong>{promo.validUntil}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Ticket className="w-4 h-4" />
                          <span style={{ color: 'var(--success)', fontWeight: 700 }}>{promo.discount}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        alert(`Kode promo "${promo.code}" berhasil disalin!`);
                      }}
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px', alignSelf: 'center' }}
                    >
                      Salin Kode
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Validation Widget */}
            <div>
              <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>Cek Kode Promo</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  Punya kode voucher khusus? Masukkan di sini untuk memeriksa masa berlaku dan penawaran yang Anda dapatkan.
                </p>

                <form onSubmit={handleValidate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: TCUMERDEKA"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    required
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Verifikasi Kode</button>
                </form>

                {validationResult && (
                  <div 
                    className="fade-in-up"
                    style={{ 
                      marginTop: '20px', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      backgroundColor: validationResult.status === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                      border: `1px solid ${validationResult.status === 'success' ? 'var(--success)' : 'var(--danger)'}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{validationResult.status === 'success' ? '🎉' : '❌'}</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {validationResult.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
