'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeknisiLayout({ children }) {
  const pathname = usePathname();
  
  const bottomNavItems = [
    { label: 'Beranda', icon: '🏠', href: '/teknisi' },
    { label: 'Work Order', icon: '📋', href: '/teknisi/wo' },
    { label: 'Scan ONT', icon: '📷', href: '/teknisi/scan' },
    { label: 'Profil', icon: '👤', href: '/teknisi/profil' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          <span style={{ color: 'var(--primary)' }}>TCU</span><span style={{ color: 'var(--text-main)' }}>Teknisi</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Online</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '16px', paddingBottom: '80px', overflowY: 'auto' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className='bottom-nav'>
        {bottomNavItems.map(item => (
          <Link key={item.href} href={item.href} className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}>
            <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
