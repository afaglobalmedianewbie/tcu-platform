'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GlobalSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate network delay to omnisearch backend
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [query]);

  // Mocked Results based on backend Module 28 specifications
  const results = [
    { type: 'CUSTOMER', id: 'CST-001', title: 'John Doe', desc: 'Address: Lintas 5, Phone: 0812345678', score: 98, path: '/admin/pelanggan/detail/CST-001' },
    { type: 'BILLING', id: 'INV-123', title: 'Invoice INV-123 (John Doe)', desc: 'Rp150,000 - UNPAID', score: 85, path: '/admin/billing/invoices/INV-123' },
    { type: 'TICKET', id: 'TKT-888', title: 'Internet Slow (CST-001)', desc: 'Reported by John Doe, Status: OPEN', score: 65, path: '/admin/ticketing/TKT-888' },
    { type: 'PPPOE', id: 'SESS-99', title: 'Session: pppoe_johndoe', desc: 'IP: 10.0.0.45, Uptime: 4d 12h', score: 40, path: '/admin/radius/monitoring' }
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()));

  const getTypeStyle = (type) => {
    switch (type) {
      case 'CUSTOMER': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', icon: '👤' };
      case 'BILLING': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', icon: '💰' };
      case 'TICKET': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', icon: '🎫' };
      case 'PPPOE': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', icon: '🌐' };
      case 'ONU': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', icon: '🔌' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', icon: '📄' };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '8px' }}>
        Omnisearch Results
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '32px' }}>
        Mencari "{query}" melintasi seluruh modul (CRM, Billing, OLT, Tiket)...
      </p>

      {loading ? (
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <h3 style={{ margin: 0, color: '#94a3b8' }}>Tidak ada hasil ditemukan.</h3>
          <p>Coba gunakan kata kunci lain (misal: "John", "INV-", "ZTE").</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map((res, i) => {
            const style = getTypeStyle(res.type);
            return (
              <Link key={i} href={res.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px',
                  transition: 'all 0.2s', cursor: 'pointer'
                }} className="search-result-card">
                  
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '10px', background: style.bg, color: style.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                  }}>
                    {style.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600 }}>{res.title}</h3>
                      <span style={{ fontSize: '0.7rem', background: style.bg, color: style.color, padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {res.type}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem' }}>{res.desc}</p>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>Relevance Score: {res.score} • ID: {res.id}</div>
                  </div>
                  
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .search-result-card:hover {
          background: rgba(30, 41, 59, 0.8) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          transform: translateX(4px);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
