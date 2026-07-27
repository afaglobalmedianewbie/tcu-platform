'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AutoLogout from '@/components/AutoLogout';
import { useLanguage, LanguageSelector } from '@/components/LanguageContext';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CreditCard, 
  Mail, 
  Network, 
  Calendar, 
  Package, 
  FileText, 
  Settings, 
  Database, 
  Shield, 
  BookOpen, 
  Server, 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';

// ─── Menu Structure with Lucide Icons ─────────────────────────────────────────
const MENU = [
  {
    section: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'NOC Dashboard', path: '/noc', icon: Activity }
    ]
  },
  {
    section: 'CRM',
    items: [
      {
        name: 'Customers', icon: Users,
        children: [
          { name: 'List Pelanggan', path: '/admin/pelanggan' },
          { name: 'Tambah Pelanggan', path: '/admin/pelanggan/add' },
          { name: 'Cari Pelanggan', path: '/admin/pelanggan/search' },
          { name: 'Vouchers', path: '/admin/pelanggan/vouchers' },
          { name: 'Peta Pelanggan', path: '/admin/pelanggan/maps' },
        ]
      },
      {
        name: 'Leads', icon: TrendingUp,
        children: [
          { name: 'Dashboard Leads', path: '/admin/crm' },
          { name: 'Tambah Lead', path: '/admin/leads/add' },
          { name: 'List Leads', path: '/admin/leads/list' },
          { name: 'Quotes', path: '/admin/leads/quotes' },
          { name: 'Peta Leads', path: '/admin/leads/maps' },
        ]
      },
      {
        name: 'Tickets', icon: AlertCircle,
        children: [
          { name: 'Dashboard Tiket', path: '/admin/ticket' },
          { name: 'List Tiket', path: '/admin/ticketing/list' },
          { name: 'Arsip', path: '/admin/ticketing/archive' },
          { name: 'Penerima', path: '/admin/ticketing/recipients' },
        ]
      },
      {
        name: 'Finance', icon: CreditCard,
        children: [
          { name: 'Dashboard Finance', path: '/admin/billing' },
          { name: 'Transaksi', path: '/admin/billing/transactions' },
          { name: 'Invoice', path: '/admin/billing/invoices' },
          { name: 'Pembayaran', path: '/admin/billing/payments' },
          { name: 'Payment Gateway', path: '/admin/pengaturan/payment-gateway' },
          { name: 'Riwayat', path: '/admin/billing/history' },
        ]
      },
      {
        name: 'Messages', icon: Mail,
        children: [
          { name: 'Inbox', path: '/admin/mail' },
          { name: 'Mass Sending', path: '/admin/mail/mass' },
          { name: 'Riwayat Kirim', path: '/admin/mail/history' },
        ]
      },
    ]
  },
  {
    section: 'COMPANY',
    items: [
      {
        name: 'Networking', icon: Globe,
        children: [
          { name: 'Radius, Mikrotik & VPN', path: '/admin/radius' },
          { name: 'OLT 2D Chassis Visualizer', path: '/admin/olt/visualizer' },
          { name: 'Map GIS Pemetaan ODP', path: '/admin/olt/location' },
          { name: 'Hardware OLT & Backup', path: '/admin/olt' },
          { name: 'VPN Server', path: '/admin/vpn' },
          { name: 'GenieACS', path: '/admin/genieacs' },
          { name: 'AI Predictive', path: '/admin/ai/predictive' },
          { name: 'AI Traffic', path: '/admin/ai/traffic' },
        ]
      },
      {
        name: 'Scheduling', icon: Calendar,
        children: [
          { name: 'Dashboard WO', path: '/admin/teknisi' },
          { name: 'Projects', path: '/admin/teknisi/projects' },
          { name: 'Tasks', path: '/admin/teknisi/tasks' },
          { name: 'Kalender', path: '/admin/teknisi/calendar' },
        ]
      },
      {
        name: 'Inventory', icon: Package,
        children: [
          { name: 'Dashboard', path: '/admin/inventory' },
          { name: 'Items', path: '/admin/inventory/items' },
          { name: 'Products', path: '/admin/inventory/products' },
          { name: 'Supply', path: '/admin/inventory/supply' },
        ]
      },
      {
        name: 'Tariff Plans', icon: FileText,
        children: [
          { name: 'Internet', path: '/admin/tariff/internet' },
          { name: 'Voice', path: '/admin/tariff/voice' },
          { name: 'Recurring', path: '/admin/tariff/recurring' },
          { name: 'One-time', path: '/admin/tariff/onetime' },
          { name: 'Bundles', path: '/admin/tariff/bundles' },
        ]
      },
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { name: 'Profil Saya', path: '/admin/profil', icon: User },
      { name: 'Administrasi', path: '/admin/audit', icon: Shield },
      { name: 'Konfigurasi', path: '/admin/config', icon: Settings },
      { name: 'Multi-Tenant SaaS', path: '/admin/tenant', icon: Server },
      { name: 'CMS Web', path: '/admin/cms', icon: FileText },
      { name: 'Disaster Recovery', path: '/admin/dr', icon: Database },
      { name: 'RBAC', path: '/admin/pengaturan/rbac', icon: Lock },
      { name: 'Webmail', path: '/admin/webmail', icon: Mail },
      { name: 'Knowledgebase', path: '/wiki', icon: BookOpen },
    ]
  },
];

// ─── Submenu Item Component ────────────────────────────────────────────────
function SubMenuItem({ item, pathname }) {
  const isActive = pathname === item.path;
  const { t } = useLanguage();
  const translationKey = item.name.toLowerCase().replace(/,\s*/g, '_').replace(/[^a-z0-9]/g, '_');
  const displayName = t(translationKey) || item.name;

  return (
    <Link 
      href={item.path} 
      className={`block py-2 pl-9 pr-4 text-xs rounded-lg transition-all duration-150 ${
        isActive 
          ? 'text-blue-400 bg-blue-500/10 font-semibold border-l-2 border-blue-500' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      {displayName}
    </Link>
  );
}

// ─── Menu Item Component ───────────────────────────────────────────────────
function MenuItem({ item, pathname, collapsed }) {
  const hasChildren = item.children?.length > 0;
  const isActiveParent = hasChildren && item.children.some(c => pathname.startsWith(c.path));
  const isActiveSelf = !hasChildren && pathname === item.path;
  const [open, setOpen] = useState(isActiveParent);
  const { t } = useLanguage();
  const translationKey = item.name.toLowerCase().replace(/,\s*/g, '_').replace(/[^a-z0-9]/g, '_');
  const displayName = t(translationKey) || item.name;
  
  const IconComponent = item.icon;

  return (
    <div className="mb-1">
      {hasChildren ? (
        <>
          <button 
            onClick={() => setOpen(o => !o)} 
            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActiveParent 
                ? 'text-blue-400 bg-blue-500/5 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="flex items-center gap-3">
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{displayName}</span>}
            </div>
            {!collapsed && (
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            )}
          </button>
          {!collapsed && open && (
            <div className="mt-1 space-y-0.5 border-l border-slate-800 ml-5">
              {item.children.map(child => (
                <SubMenuItem key={child.path} item={child} pathname={pathname} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link 
          href={item.path} 
          target={item.path === '/wiki' || item.path.startsWith('http') ? '_blank' : undefined}
          rel={item.path === '/wiki' || item.path.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-200 ${
            isActiveSelf 
              ? 'text-blue-400 bg-blue-500/10 font-semibold border-l-2 border-blue-500' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          } ${collapsed ? 'justify-center' : ''}`}
        >
          <IconComponent className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">{displayName}</span>}
        </Link>
      )}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({ full_name: 'Super Admin', role: 'ADMIN', email: 'admin@topclassuniversal.co.id' });
  const [timeoutMinutes, setTimeoutMinutes] = useState(5);
  const [authorized, setAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [rbacSettings, setRbacSettings] = useState({
    SUPERADMIN: ['Dashboard', 'NOC Dashboard', 'Customers', 'Leads', 'Tickets', 'Finance', 'Messages', 'Networking', 'Scheduling', 'Inventory', 'Tariff Plans', 'Administrasi', 'Konfigurasi', 'Multi-Tenant SaaS', 'CMS Web', 'Disaster Recovery', 'Webmail', 'RBAC', 'Knowledgebase', 'AI Predictive', 'AI Traffic', 'Profil Saya'],
    ADMIN: ['Dashboard', 'NOC Dashboard', 'Customers', 'Leads', 'Tickets', 'Finance', 'Messages', 'Networking', 'Scheduling', 'Inventory', 'Tariff Plans', 'Administrasi', 'Konfigurasi', 'Multi-Tenant SaaS', 'CMS Web', 'Webmail', 'RBAC', 'Knowledgebase', 'AI Predictive', 'AI Traffic', 'Profil Saya'],
    CS: ['Dashboard', 'Customers', 'Tickets', 'Leads', 'Messages', 'Knowledgebase', 'Profil Saya'],
    NOC: ['Dashboard', 'NOC Dashboard', 'Networking', 'Scheduling', 'Tickets', 'Knowledgebase', 'AI Predictive', 'AI Traffic', 'Profil Saya'],
    FINANCE: ['Dashboard', 'Finance', 'Tariff Plans', 'Customers', 'Knowledgebase', 'Profil Saya'],
    SALES: ['Dashboard', 'Leads', 'Customers', 'Knowledgebase', 'Profil Saya'],
    TECHNICIAN: ['Dashboard', 'Inventory', 'Scheduling', 'Tickets', 'Knowledgebase', 'Profil Saya'],
    CUSTOMER: []
  });

  useEffect(() => {
    const token = localStorage.getItem('tcu_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Verify token validity
    fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAuthorized(true);
          setUser(data.user);
          localStorage.setItem('tcu_user', JSON.stringify(data.user));
          if (data.user.preferences?.timeout) {
            setTimeoutMinutes(data.user.preferences.timeout);
          }
        } else {
          localStorage.removeItem('tcu_token');
          localStorage.removeItem('tcu_user');
          router.push('/login');
        }
      })
      .catch(() => {
        const cachedUserStr = localStorage.getItem('tcu_user');
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            if (cachedUser && (cachedUser.role === 'SUPERADMIN' || cachedUser.role === 'ADMIN' || cachedUser.email?.includes('ceo') || cachedUser.email?.includes('admin'))) {
              setUser(cachedUser);
              setAuthorized(true);
              return;
            }
          } catch (e) {}
        }
        localStorage.removeItem('tcu_token');
        localStorage.removeItem('tcu_user');
        router.push('/login');
      });

    // Fetch RBAC Settings
    fetch('/api/cms', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.rbac_settings) {
          try {
            let parsedRbac = typeof data.data.rbac_settings === 'string' ? JSON.parse(data.data.rbac_settings) : data.data.rbac_settings;
            setRbacSettings(prev => ({ ...prev, ...parsedRbac }));
          } catch(e) {
            console.error('Error parsing rbac_settings:', e);
          }
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tcu_token');
    localStorage.removeItem('tcu_user');
    router.push('/login');
  };

  const initials = (user.full_name || 'SA').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const NOTIFS = [
    { icon: '🔴', text: 'Tiket baru: LOS merah area Barat', time: '5m lalu' },
    { icon: '💰', text: 'Invoice INV-2026-0031 berhasil dibayar', time: '23m lalu' },
    { icon: '⚡', text: '3 pelanggan baru mendaftar hari ini', time: '1j lalu' },
    { icon: '🔧', text: 'WO-0041 selesai dikerjakan Teknisi Andi', time: '2j lalu' },
  ];

  if (!authorized) {
    return (
      <div className="flex min-h-screen bg-[#0f172a] items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium">Memverifikasi sesi keamanan...</div>
        </div>
      </div>
    );
  }

  // Active items based on RBAC
  const isSuperAdminUser = user.role === 'SUPERADMIN' || user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo';

  const allowedMenu = MENU.map(section => {
    const items = section.items.filter(item => {
      // Always allow Profil Saya for all roles
      if (item.name === 'Profil Saya') return true;

      // Disaster Recovery is strictly SUPERADMIN only
      if (item.name === 'Disaster Recovery') {
        return isSuperAdminUser;
      }

      // SUPERADMIN gets full menu access
      if (isSuperAdminUser) return true;

      // Resolve role-specific permissions
      const userRole = user.role || 'ADMIN';
      const roleList = rbacSettings[userRole] || rbacSettings.ADMIN;

      // If no custom RBAC array exists or role is unmapped, default to allowed
      if (!roleList || !Array.isArray(roleList) || roleList.length === 0) return true;

      return roleList.includes(item.name);
    }).map(item => {
      if (item.children) {
        let allowedChildren = item.children;
        const userRole = user.role || 'ADMIN';
        if (!isSuperAdminUser) {
          if (userRole === 'TECHNICIAN') {
            allowedChildren = item.children.filter(c => 
              ['Radius, Mikrotik & VPN', 'Dashboard WO', 'Projects', 'Tasks', 'Kalender', 'Dashboard', 'Items', 'Supply', 'OLT 2D Chassis Visualizer', 'Hardware OLT & Backup'].includes(c.name)
            );
          } else if (userRole === 'CS' || userRole === 'SALES' || userRole === 'FINANCE') {
            allowedChildren = item.children.filter(c => 
              !['GenieACS', 'VPN Server', 'AI Predictive', 'AI Traffic'].includes(c.name)
            );
          }
        }
        return { ...item, children: allowedChildren };
      }
      return item;
    });
    return { ...section, items };
  }).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex font-sans overflow-x-hidden">
      <AutoLogout timeoutMinutes={timeoutMinutes} />
      
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar (Desktop & Mobile Drawer) ─────────────────────────────────────────── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1e293b]/95 border-r border-[#334155] transition-all duration-300 lg:static lg:bg-[#1e293b]/40 lg:backdrop-blur-md ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header (Logo) */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#334155] flex-shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-blue-500 font-black text-lg tracking-tight">TCU</span>
              <span className="text-slate-300 font-extrabold text-sm border-l border-slate-700 pl-2">Platform</span>
            </Link>
          )}
          {collapsed && (
            <span className="mx-auto text-blue-500 font-black text-xl">T</span>
          )}
          <button 
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileOpen(false)}
            className="flex lg:hidden items-center justify-center p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {allowedMenu.map(section => (
            <div key={section.section}>
              {!collapsed && (
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">
                  {t(section.section.toLowerCase()) || section.section}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <MenuItem key={item.name} item={item} pathname={pathname} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ─── Main Area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        
        {/* Topbar Header */}
        <header className="h-16 bg-[#1e293b]/40 backdrop-blur-md border-b border-[#334155] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-blue-500 font-bold">TCU</span>
              <span>/</span>
              <span className="text-slate-200">
                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').slice(2).join(' › ').replace(/^\w/, c => c.toUpperCase()) || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right Side Widgets */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Real-time Status Indicators */}
            <div className="hidden xl:flex items-center gap-3 bg-slate-900/60 border border-[#334155] rounded-xl px-3 py-1.5 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>VPN</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>SNMP</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>ACS</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>CF Tunnel</span>
              </div>
            </div>

            {/* Global Search */}
            <form 
              onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`); }}
              className="relative hidden md:flex items-center"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sesuatu (Ctrl+K)..."
                className="w-48 xl:w-56 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900 border border-[#334155] text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </form>

            <LanguageSelector />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-xl bg-slate-800/40 border border-[#334155] text-slate-400 hover:text-white transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1e293b] border border-[#334155] rounded-2xl shadow-xl shadow-black/40 overflow-hidden z-50">
                  <div className="p-3 border-b border-[#334155] flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Notifikasi</span>
                    <button className="text-blue-400 hover:text-blue-300">Tandai semua</button>
                  </div>
                  <div className="divide-y divide-[#334155]/60 max-h-64 overflow-y-auto">
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="p-3 flex gap-2 items-start text-xs hover:bg-slate-800/40 cursor-pointer">
                        <span className="text-sm flex-shrink-0">{n.icon}</span>
                        <div>
                          <p className="text-slate-300 leading-tight">{n.text}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 md:p-1.5 rounded-xl bg-slate-800/40 border border-[#334155] hover:border-slate-600 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {initials}
                </div>
                <span className="hidden md:inline text-xs text-slate-200 max-w-[80px] truncate font-medium">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-2xl shadow-xl shadow-black/40 overflow-hidden z-50 text-xs">
                  <div className="p-3 border-b border-[#334155]">
                    <p className="font-semibold text-slate-200 truncate">{user.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <Link href="/admin/profil" className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-800/60 transition">
                    <User className="w-3.5 h-3.5 text-violet-400" /> Profil Saya
                  </Link>
                  <Link href="/admin/profil" className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:bg-slate-800/60 transition">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Keamanan / 2FA
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition border-t border-[#334155]/60 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Keluar
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ─── Main Content Area ─── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#0f172a] overflow-x-hidden relative">
          
          {user && user.needs2FASetup && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 md:mt-0 text-amber-500" />
                <div>
                  <h4 className="font-bold text-sm text-slate-250">Segera Aktifkan 2FA!</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Keamanan Two-Factor Authentication akun Anda belum aktif. Segera konfigurasikan.</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/admin/pengaturan')} 
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition flex-shrink-0 self-start md:self-auto"
              >
                Konfigurasi Sekarang
              </button>
            </div>
          )}

          {children}
        </main>
      </div>

    </div>
  );
}
