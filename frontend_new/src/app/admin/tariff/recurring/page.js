'use client';
import Link from 'next/link';
export default function Page() {
  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '2rem' }}>🔁</div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Recurring Plans</h1>
          <p style={{ color: '#475569', fontSize: '0.85rem', margin: '4px 0 0' }}>Halaman ini sedang dalam pengembangan.</p>
        </div>
      </div>
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>Segera Hadir</h2>
        <p style={{ color: '#475569', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto' }}>
          Modul <strong style={{ color: '#3b82f6' }}>Recurring Plans</strong> sedang kami kembangkan dan akan segera tersedia.
        </p>
        <Link href="/admin" style={{ display: 'inline-block', marginTop: '24px', padding: '10px 24px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>← Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
