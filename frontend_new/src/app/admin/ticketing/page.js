'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock Data
const stats = [
  { label: 'Total Tiket Aktif', value: '142', icon: '🎫', trend: '-5.2%', color: '#3b82f6' },
  { label: 'Tiket Baru (Open)', value: '28', icon: '🆕', trend: '+12%', color: '#ef4444' },
  { label: 'Sedang Dikerjakan', value: '45', icon: '🔧', trend: '-2%', color: '#f59e0b' },
  { label: 'Selesai (Hari Ini)', value: '18', icon: '✅', trend: '+20%', color: '#10b981' },
];

const recentTickets = [
  { id: 'TKT-9928', customer: 'Budi Santoso', subject: 'LOS Merah / Tidak Ada Internet', priority: 'HIGH', status: 'OPEN', date: '10 Jul, 08:30' },
  { id: 'TKT-9929', customer: 'CV Maju Jaya', subject: 'Koneksi Lambat Siang Hari', priority: 'MEDIUM', status: 'IN_PROGRESS', date: '10 Jul, 09:15' },
  { id: 'TKT-9930', customer: 'Ahmad Dahlan', subject: 'Ganti Password WiFi', priority: 'LOW', status: 'RESOLVED', date: '09 Jul, 15:40' },
  { id: 'TKT-9931', customer: 'PT Makmur', subject: 'Request Public IP', priority: 'MEDIUM', status: 'OPEN', date: '10 Jul, 10:05' },
];

export default function TicketingDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasikan fetching data
    setTimeout(() => setLoading(false), 500);
  }, []);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>HIGH</span>;
      case 'MEDIUM': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>MEDIUM</span>;
      case 'LOW': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' }}>LOW</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }}/> OPEN</span>;
      case 'IN_PROGRESS': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}/> IN PROGRESS</span>;
      case 'RESOLVED': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}/> RESOLVED</span>;
      default: return null;
    }
  };

  if (loading) return <div style={{ color: '#94a3b8', animation: 'pulse 1.5s infinite' }}>Memuat data tiket...</div>;

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>Ticketing & Helpdesk</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pusat manajemen keluhan dan permintaan layanan pelanggan.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Cari Tiket
          </button>
          <button style={{ padding: '10px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
            <span>➕</span> Buat Tiket Manual
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.05 }}>{s.icon}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '6px 10px' }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>{s.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <span style={{ color: s.color, fontWeight: 700 }}>{s.trend}</span>
              <span style={{ color: '#64748b' }}>vs minggu lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* TICKET TABLE */}
      <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>Tiket Aktif Terbaru</h2>
          <Link href="/admin/ticketing/list" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua Antrean &rarr;</Link>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>ID / Prioritas</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Subjek Keluhan</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Pelanggan</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Waktu Laporan</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((tkt, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '6px' }}>{tkt.id}</div>
                  <div>{getPriorityBadge(tkt.priority)}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{tkt.subject}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{tkt.customer}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{tkt.date}</td>
                <td style={{ padding: '16px' }}>{getStatusBadge(tkt.status)}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(59,130,246,0.5)', color: '#3b82f6', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Tinjau</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
