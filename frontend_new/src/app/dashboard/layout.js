'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AutoLogout from '@/components/AutoLogout';
import { useLanguage, LanguageSelector } from '@/components/LanguageContext';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tcu_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setAuthorized(true);
    const stored = localStorage.getItem('tcu_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);
  
  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: '📊' },
    { name: t('billing'), path: '/dashboard/tagihan', icon: '💳' },
    { name: t('help'), path: '/dashboard/bantuan', icon: '🎧' },
    { name: t('documents'), path: '/dashboard/dokumen', icon: '📄' },
    { name: t('notifications'), path: '/dashboard/notifikasi', icon: '🔔' },
    { name: t('profile'), path: '/dashboard/profil', icon: '👤' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('tcu_token');
    localStorage.removeItem('tcu_user');
    window.location.href = '/login';
  };

  if (!authorized) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'sans-serif' }}>
        <div>{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <AutoLogout timeoutMinutes={5} />
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      
      {/* Sidebar Desktop/Mobile Overlay */}
      <aside className={`glass-panel dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{ width: '280px', margin: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 32px)', position: 'sticky', top: '16px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '40px', paddingLeft: '12px' }}>
          <span style={{ color: 'var(--primary)' }}>TCU</span><span style={{ color: 'var(--text-main)' }}>ISP</span>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <Link key={item.path} onClick={() => setMobileOpen(false)} href={item.path} className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', 
              color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', 
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            ↩ Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, padding: '32px 40px', maxWidth: '100%', minWidth: 0 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {/* Mobile hamburger menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} style={{
            display: 'none',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#94a3b8',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto' }}>
            <Link href='/dashboard/notifikasi' style={{ position: 'relative', fontSize: '1.4rem' }}>
              🔔
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--bg-color)' }}></span>
            </Link>
          </div>
        </header>
        {user && user.needs2FASetup && (
          <div style={{ margin: '0 0 24px 0', padding: '16px 24px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700 }}>Segera Amankan Akun Anda!</div>
                <div style={{ fontSize: '0.9rem' }}>Fitur Autentikasi Dua Langkah (2FA) belum aktif. Ini sangat disarankan.</div>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
