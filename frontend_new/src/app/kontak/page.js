'use client';
import { useState } from 'react';



export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API call
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      <main style={{ flex: 1, padding: '80px 40px' }}>
        <div className="container fade-in-up">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-info" style={{ marginBottom: '16px' }}>Hubungi Kami</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Kontak & Dukungan
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Ada pertanyaan, masukan, atau kendala dengan layanan kami? Jangan ragu untuk menghubungi tim profesional kami.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Contact Info Column */}
            <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>Hubungi Kami</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                  Kami siap melayani kebutuhan konsultasi jaringan internet Anda 24 jam sehari. Hubungi kami melalui kanal berikut atau kunjungi kantor operasional kami.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.8rem', background: 'rgba(37,99,235,0.15)', color: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>📍</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Alamat Kantor</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                      PT Top Class Universal<br />
                      Jalan Raya Banjar-Pangandaran, Jawa Barat, Indonesia
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.8rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', padding: '10px', borderRadius: '12px' }}>📞</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>WhatsApp / Telepon</h3>
                    <a href="https://wa.me/6282319140858" style={{ color: 'var(--accent)', fontSize: '0.95rem', marginTop: '4px', display: 'block' }}>
                      +62 823-1914-0858
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.8rem', background: 'rgba(56,189,248,0.15)', color: 'var(--accent)', padding: '10px', borderRadius: '12px' }}>✉️</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Alamat Email</h3>
                    <a href="mailto:info@topclassuniversal.co.id" style={{ color: 'var(--accent)', fontSize: '0.95rem', marginTop: '4px', display: 'block' }}>
                      info@topclassuniversal.co.id
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: 'auto' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  *Dukungan Teknis Pelanggan Top Class Universal tersedia 24/7 melalui nomor WhatsApp Helpdesk.
                </p>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Kirim Pesan</h2>
              
              {submitted ? (
                <div 
                  className="fade-in-up" 
                  style={{
                    padding: '24px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--success)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✉️</span>
                  <h3 style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>Pesan Terkirim!</h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Terima kasih telah menghubungi kami. Pesan Anda telah berhasil dikirim ke PT Top Class Universal. Tim kami akan segera meninjau dan merespons pesan Anda.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary"
                    style={{ marginTop: '20px', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alamat Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="contoh@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Isi Pesan</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder="Tuliskan pertanyaan atau keluhan Anda di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{ resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                    Kirim Pesan ⚡
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      
    </div>
  );
}
