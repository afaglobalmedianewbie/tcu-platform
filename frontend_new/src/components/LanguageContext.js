'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    // General / Common
    logout: "Keluar",
    dashboard: "Dasbor",
    loading: "Memuat...",
    active: "Aktif",
    isolated: "Terisolir",
    installation: "Instalasi",
    unpaid: "Belum Bayar",
    paid: "Lunas",
    save: "Simpan",
    search: "Cari...",
    home: "Beranda",
    services: "Layanan",
    company: "Perusahaan",
    coverage: "Area Layanan",
    blog: "Blog",
    client_portal: "Portal Pelanggan",
    contact_us: "Hubungi Kami",
    about_us: "Tentang Kami",
    company_profile: "Profil Perusahaan",
    careers: "Karir",
    partners: "Partner",
    
    // Landing Page
    brand_sub: "Platform ISP Modern #1 di Indonesia",
    hero_title1: "Internet Fiber Optic",
    hero_title2: "Cepat & Tanpa Hambatan",
    hero_desc: "Nikmati koneksi stabil untuk rumah dan bisnis Anda. Dukungan teknis 24/7 dan pembayaran mudah dari mana saja.",
    cek_coverage: "⚡ Cek Coverage Gratis",
    lihat_paket: "Lihat Paket",
    login_btn: "Masuk",
    register_btn: "Daftar Sekarang",
    choose_packet: "Pilih Paket",
    popular_badge: "🔥 Paling Populer",
    starter_desc: "Untuk 1-3 pengguna · Cocok belajar & WFH · Support 24/7",
    popular_desc: "Untuk 3-8 pengguna · Streaming HD & Gaming · Static IP opsional",
    business_desc: "Untuk kantor & bisnis · Dedicated bandwidth · SLA & prioritas CS",
    
    // Customer Dashboard
    billing: "Tagihan",
    help: "Bantuan & Tiket",
    documents: "Dokumen",
    notifications: "Notifikasi",
    profile: "Profil & Akun",
    connection_status: "Status Koneksi",
    active_packet: "Paket Aktif",
    active_bill: "Tagihan Aktif",
    recent_tickets: "Tiket Terakhir",
    quick_actions: "Aksi Cepat",
    uptime_desc: "Uptime 99.9% bulan ini",
    popular_desc_price: "TopClass Popular · Rp 350.000/bln",
    due_date: "Jatuh tempo",
    pay_now_title: "⚠️ Tagihan Belum Dibayar",
    pay_now_desc: "Bayar sebelum jatuh tempo untuk menghindari isolir layanan.",
    pay_now_btn: "Bayar Sekarang",
    ticket_status_processing: "Diproses",
    ticket_status_resolved: "Selesai",
    see_all: "Lihat semua",
    account_summary: "Ringkasan Akun",

    // Admin Dashboard
    admin_title: "Dashboard Operasional",
    total_customers: "Total Pelanggan",
    revenue: "Pendapatan Tagihan",
    active_tickets: "Tiket Aktif",
    cpu_load: "Beban CPU Server",
    recent_customers: "Pelanggan Terbaru",
    status_distribution: "Distribusi Status",
    active_emails: "Daftar Akun Email Aktif (Super Admin)",
    recent_tickets_admin: "Tiket Masuk Terkini",
    recent_invoices_admin: "Invoice Terbaru",
    quick_actions_admin: "⚡ Aksi Cepat",
    system_log: "Log Aktivitas Sistem (Real)",
    live_server_stats: "🖥️ Live Server Resource",
    add_customer: "＋ Tambah Pelanggan",
    financial_report: "📊 Laporan Keuangan",
    empty_emails: "Tidak ada email aktif yang terdaftar di database.",
    server_connecting: "Menghubungkan ke monitor server...",
    online: "Online",
    docker_status: "Docker Containers Status:",
    
    // Sidebar / Menu
    main: "Menu Utama",
    crm: "CRM & Pelanggan",
    system: "Sistem & Admin",
    customers: "Pelanggan",
    leads: "Prospek (Leads)",
    tickets: "Tiket Bantuan",
    finance: "Keuangan",
    messages: "Pesan & Webmail",
    networking: "Jaringan",
    scheduling: "Penjadwalan",
    inventory: "Inventaris",
    tariff_plans: "Paket Tarif",
    administrasi: "Administrasi",
    konfigurasi: "Konfigurasi",
    cms_web: "CMS Web",
    rbac: "Kontrol Akses (RBAC)",
    webmail: "Webmail",
    knowledgebase: "Pusat Bantuan",
    
    list_pelanggan: "Daftar Pelanggan",
    tambah_pelanggan: "Tambah Pelanggan",
    cari_pelanggan: "Cari Pelanggan",
    vouchers: "Voucher",
    peta_pelanggan: "Peta Pelanggan",
    dashboard_leads: "Dasbor Prospek",
    tambah_lead: "Tambah Prospek",
    list_leads: "Daftar Prospek",
    quotes: "Penawaran (Quotes)",
    peta_leads: "Peta Prospek",
    dashboard_tiket: "Dasbor Tiket",
    list_tiket: "Daftar Tiket",
    arsip: "Arsip Tiket",
    penerima: "Penerima Notifikasi",
    dashboard_finance: "Dasbor Keuangan",
    transaksi: "Daftar Transaksi",
    invoice: "Daftar Invoice",
    pembayaran: "Riwayat Bayar",
    payment_gateway: "Gerbang Pembayaran",
    riwayat: "Riwayat Sistem",
    inbox: "Kotak Masuk",
    mass_sending: "Kirim Massal",
    riwayat_kirim: "Riwayat Email",
    radius_mikrotik_vpn: "Radius & VPN",
    olt_2d_chassis_visualizer: "Visualizer Chassis 2D OLT",
    hardware_olt___backup: "Hardware OLT & Auto-Backup",
    olt_infrastructure: "Infrastruktur OLT",
    vpn_server: "Server VPN (WireGuard)",
    genieacs: "Manajemen ONT (GenieACS)",
    routers: "Routers & NAS",
    acs_devices: "Perangkat ACS (TR-069)",
    hardware_olt: "Hardware OLT",
    dashboard_wo: "Perintah Kerja (WO)",
    projects: "Proyek",
    tasks: "Daftar Tugas",
    kalender: "Kalender Kerja",
    items: "Daftar Barang",
    products: "Katalog Produk",
    supply: "Pasokan & Stok",
    internet: "Paket Internet",
    voice: "Paket Telepon",
    recurring: "Biaya Berkala",
    one_time: "Biaya Sekali Bayar",
    bundles: "Paket Bundling",
    
    // Mail Management Page
    email_accounts_total: "Total Akun Email",
    email_domain_sub: "Domain @topclassuniversal.co.id",
    active_accounts: "Akun Aktif",
    dovecot_status_sub: "Status aktif di Dovecot",
    mail_server_status: "Status Mail Server",
    dkim_active_title: "🔐 DKIM Aktif — mail._domainkey.topclassuniversal.co.id",
    dkim_active_desc: "Tambahkan TXT record DKIM ke Cloudflare/GoDaddy agar email tidak masuk spam. OpenDKIM berjalan di port 8891.",
    inbox_account_list: "Daftar Akun Email Masuk",
    inbox_account_desc: "Akun email masuk staff yang terhubung ke server.",
    table_staff_name: "Nama Staff",
    table_quota: "Kapasitas Kuota",
    table_status: "Status",
    table_action: "Aksi",
    btn_change_password: "🔑 Ganti Password",
    btn_delete: "🗑️ Hapus",
    btn_open_webmail: "Buka Webmail →",
    webmail_access_title: "Akses Webmail (Roundcube)",
    webmail_access_desc: "Login sebagai pengguna email untuk mengirim & menerima pesan.",
    open_in_new_tab: "Buka di Tab Baru",
    rbac_management_title: "🔑 Pengelolaan Akun & Sandi Staff (RBAC)",
    rbac_management_desc: "Daftar lengkap kredensial masuk staf berwenang pada sistem.",
    super_admin_only: "Khusus Super Admin",
    table_full_name: "Nama Lengkap",
    table_username: "Username",
    table_email_active: "Email Aktif",
    table_role_access: "Peran Akses",
    table_phone: "No. Telepon",
    loading_credentials: "Memuat data kredensial...",
    no_staff_accounts: "Tidak ada data akun staff.",
    noc_dashboard: "NOC Dashboard",
    ai_predictive_engine: "AI Predictive Engine",
    disaster_recovery: "Disaster Recovery"
  },
  en: {
    // General / Common
    logout: "Logout",
    dashboard: "Dashboard",
    loading: "Loading...",
    active: "Active",
    isolated: "Isolated",
    installation: "Installation",
    unpaid: "Unpaid",
    paid: "Paid",
    save: "Save",
    search: "Search...",
    home: "Home",
    services: "Services",
    company: "Company",
    coverage: "Coverage Area",
    blog: "Blog",
    client_portal: "Client Portal",
    contact_us: "Contact Us",
    about_us: "About Us",
    company_profile: "Company Profile",
    careers: "Careers",
    partners: "Partners",
    
    // Landing Page
    brand_sub: "#1 Modern ISP Platform in Indonesia",
    hero_title1: "Fiber Optic Internet",
    hero_title2: "Fast & Unlimited",
    hero_desc: "Enjoy stable connections for your home and business. 24/7 technical support and easy online payments from anywhere.",
    cek_coverage: "⚡ Check Free Coverage",
    lihat_paket: "See Packages",
    login_btn: "Sign In",
    register_btn: "Register Now",
    choose_packet: "Choose Package",
    popular_badge: "🔥 Most Popular",
    starter_desc: "For 1-3 users · Great for study & WFH · 24/7 Support",
    popular_desc: "For 3-8 users · HD Streaming & Gaming · Optional Static IP",
    business_desc: "For office & business · Dedicated bandwidth · SLA & CS priority",
    
    // Customer Dashboard
    billing: "Billing",
    help: "Help & Tickets",
    documents: "Documents",
    notifications: "Notifications",
    profile: "Profile & Account",
    connection_status: "Connection Status",
    active_packet: "Active Package",
    active_bill: "Active Bill",
    recent_tickets: "Recent Tickets",
    quick_actions: "Quick Actions",
    uptime_desc: "Uptime 99.9% this month",
    popular_desc_price: "TopClass Popular · Rp 350,000/mo",
    due_date: "Due date",
    pay_now_title: "⚠️ Unpaid Invoice",
    pay_now_desc: "Pay before the due date to avoid service isolation.",
    pay_now_btn: "Pay Now",
    ticket_status_processing: "Processing",
    ticket_status_resolved: "Resolved",
    see_all: "See all",
    account_summary: "Account Summary",
 
    // Admin Dashboard
    admin_title: "Operational Dashboard",
    total_customers: "Total Customers",
    revenue: "Billing Revenue",
    active_tickets: "Active Tickets",
    cpu_load: "Server CPU Load",
    recent_customers: "Recent Customers",
    status_distribution: "Status Distribution",
    active_emails: "Active Email Accounts (Super Admin)",
    recent_tickets_admin: "Recent Inbox Tickets",
    recent_invoices_admin: "Recent Invoices",
    quick_actions_admin: "⚡ Quick Actions",
    system_log: "System Activity Log (Real)",
    live_server_stats: "🖥️ Live Server Resource",
    add_customer: "＋ Add Customer",
    financial_report: "📊 Financial Report",
    empty_emails: "No active email accounts registered in database.",
    server_connecting: "Connecting to server monitor...",
    online: "Online",
    docker_status: "Docker Containers Status:",
    
    // Sidebar / Menu
    main: "Main Menu",
    crm: "CRM & Customers",
    system: "System & Admin",
    customers: "Customers",
    leads: "Leads",
    tickets: "Support Tickets",
    finance: "Finance & Billing",
    messages: "Messages & Webmail",
    networking: "Networking",
    scheduling: "Scheduling",
    inventory: "Inventory",
    tariff_plans: "Tariff Plans",
    administrasi: "Administration",
    konfigurasi: "Settings",
    cms_web: "Web CMS",
    rbac: "Access Control (RBAC)",
    webmail: "Webmail",
    knowledgebase: "Help Center",
    
    list_pelanggan: "Customer List",
    tambah_pelanggan: "Add Customer",
    cari_pelanggan: "Search Customer",
    vouchers: "Vouchers",
    peta_pelanggan: "Customer Maps",
    dashboard_leads: "Leads Dashboard",
    tambah_lead: "Add Lead",
    list_leads: "Leads List",
    quotes: "Quotes",
    peta_leads: "Leads Maps",
    dashboard_tiket: "Tickets Dashboard",
    list_tiket: "Tickets List",
    arsip: "Archived Tickets",
    penerima: "Notification Recipients",
    dashboard_finance: "Finance Dashboard",
    transaksi: "Transactions",
    invoice: "Invoices",
    pembayaran: "Payment History",
    payment_gateway: "Payment Gateway",
    riwayat: "System Logs",
    inbox: "Inbox",
    mass_sending: "Mass Mail",
    riwayat_kirim: "Mail History",
    radius_mikrotik_vpn: "Radius & VPN",
    olt_2d_chassis_visualizer: "OLT 2D Chassis Visualizer",
    hardware_olt___backup: "OLT Hardware & Backup",
    olt_infrastructure: "OLT Infrastructure",
    vpn_server: "VPN Server (WireGuard)",
    genieacs: "ONT Management (GenieACS)",
    routers: "Routers & NAS",
    acs_devices: "ACS Devices (TR-069)",
    hardware_olt: "OLT Hardware",
    dashboard_wo: "Work Orders (WO)",
    projects: "Projects",
    tasks: "Task List",
    kalender: "Work Calendar",
    items: "Item List",
    products: "Product Catalog",
    supply: "Supply & Stock",
    internet: "Internet Plans",
    voice: "Voice Plans",
    recurring: "Recurring Fees",
    one_time: "One-time Fees",
    bundles: "Bundles",
    
    // Mail Management Page
    email_accounts_total: "Total Email Accounts",
    email_domain_sub: "Domain @topclassuniversal.co.id",
    active_accounts: "Active Accounts",
    dovecot_status_sub: "Active status in Dovecot",
    mail_server_status: "Mail Server Status",
    dkim_active_title: "🔐 DKIM Active — mail._domainkey.topclassuniversal.co.id",
    dkim_active_desc: "Add DKIM TXT record to Cloudflare/GoDaddy to prevent spam filters. OpenDKIM is running on port 8891.",
    inbox_account_list: "Inbox Email Accounts",
    inbox_account_desc: "Staff email inbox accounts connected to the server.",
    table_staff_name: "Staff Name",
    table_quota: "Quota Capacity",
    table_status: "Status",
    table_action: "Action",
    btn_change_password: "🔑 Change Password",
    btn_delete: "🗑️ Delete",
    btn_open_webmail: "Open Webmail →",
    webmail_access_title: "Webmail Access (Roundcube)",
    webmail_access_desc: "Log in as an email user to send & receive messages.",
    open_in_new_tab: "Open in New Tab",
    rbac_management_title: "🔑 Staff Account & Password Management (RBAC)",
    rbac_management_desc: "Complete list of authorized staff credentials in the system.",
    super_admin_only: "Super Admin Only",
    table_full_name: "Full Name",
    table_username: "Username",
    table_email_active: "Active Email",
    table_role_access: "Access Role",
    table_phone: "Phone Number",
    loading_credentials: "Loading credentials...",
    no_staff_accounts: "No staff account data.",
    noc_dashboard: "NOC Dashboard",
    ai_predictive_engine: "AI Predictive Engine",
    disaster_recovery: "Disaster Recovery"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');

  useEffect(() => {
    const saved = localStorage.getItem('tcu_lang');
    if (saved === 'en' || saved === 'id') {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'id') {
      setLang(newLang);
      localStorage.setItem('tcu_lang', newLang);
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── LANGUAGE SELECTOR COMPONENT ─────────────────────────────────────────────
export function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <button 
        onClick={() => changeLanguage('id')}
        style={{
          border: 'none',
          background: lang === 'id' ? '#3b82f6' : 'transparent',
          color: lang === 'id' ? '#fff' : '#94a3b8',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        🇮🇩 ID
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        style={{
          border: 'none',
          background: lang === 'en' ? '#3b82f6' : 'transparent',
          color: lang === 'en' ? '#fff' : '#94a3b8',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
