'use client';

import React from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Pemilik Homestay',
    company: 'Pangandaran Cozy Stay',
    content: 'Sejak menggunakan internet fiber dari Top Class Universal, homestay kami kebanjiran review positif dari tamu asing karena koneksinya super kencang dan stabil. Sangat menunjang bisnis akomodasi kami.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    role: 'Pengusaha Kopi',
    company: 'Banjar Coffee Roastery',
    content: 'Layanan internetnya sangat bisa diandalkan. Kasir POS online dan live streaming promosi di kafe kami berjalan lancar tanpa buffer sama sekali. Tim support teknisnya juga cepat tanggap jika ditanya.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    id: '3',
    name: 'Rahmat Hidayat',
    role: 'Remote Software Engineer',
    company: 'TechCorp Singapore',
    content: 'Sebagai remote worker di Ciamis, kestabilan koneksi internet adalah segalanya. Layanan bisnis dari TCU terbukti memiliki latensi yang sangat rendah ke server Singapura dan IP Publik stabil untuk VPN.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    role: 'Ibu Rumah Tangga',
    company: 'Paket Retail Rumahan',
    content: 'Paket Home Premium dari Top Class Universal sangat pas untuk keluarga kami. Anak-anak lancar belajar online, suami kerja dari rumah, dan kami sekeluarga bebas streaming serial favorit tanpa FUP kuota.',
    rating: 5,
    avatar: '👩‍💻'
  }
];

export default function TestimoniPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: '80px 24px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-in-up">
            <span className="badge badge-info" style={{ marginBottom: '16px' }}>Cerita Sukses Pelanggan</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Testimoni Pelanggan<br />
              <span style={{ color: 'var(--primary)' }}>Top Class Universal</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Apa kata mereka yang telah merasakan kestabilan dan kecepatan koneksi fiber optik kami untuk bisnis dan keluarga.
            </p>
          </div>

          {/* Testimonial Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }} className="grid-4col">
            {testimonials.map((t) => (
              <div 
                key={t.id} 
                className="glass-panel" 
                style={{ 
                  padding: '30px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Quote Icon Overlay */}
                <Quote className="w-12 h-12" style={{ position: 'absolute', right: '20px', bottom: '20px', color: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }} />

                <div>
                  {/* Rating */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: 'var(--warning)' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                    "{t.content}"
                  </p>
                </div>

                {/* Profile Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '1.8rem', padding: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{t.name}</h4>
                    <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 650, marginTop: '2px' }}>
                      {t.role} · <span style={{ color: 'var(--text-muted)' }}>{t.company}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Call to action */}
          <div 
            className="glass-panel" 
            style={{ 
              marginTop: '60px', 
              padding: '40px', 
              textAlign: 'center', 
              backgroundImage: 'radial-gradient(circle at top right, rgba(37,99,235,0.08) 0%, transparent 60%)' 
            }}
          >
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>Bagikan Pengalaman Anda</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Punya cerita menarik selama menggunakan layanan internet fiber kami? Tulis feedback Anda sekarang.
            </p>
            <button 
              onClick={() => alert('Terima kasih! Formulir pengiriman feedback pelanggan akan segera dikirim.')}
              className="btn-primary" 
              style={{ padding: '12px 30px' }}
            >
              Kirim Feedback
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
