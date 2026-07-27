# 🚀 TCU Platform v2.0 - The Ultimate Patch
*Changelog & Dokumentasi Frontend*

Pembaruan (Patch) ini adalah transformasi besar-besaran untuk menyatukan puluhan layanan backend korporat (Mulai dari OLT Manajemen, CRM, Ticketing, NOC, AI Traffic, hingga Disaster Recovery) ke dalam antarmuka visual (Frontend) yang mewah, responsif, dan terpusat. 

TCU Platform v2.0 dianggap sebagai "Patch Terbaik" yang menjahit ekosistem yang sudah ada (multibahasa i18n & Super Admin) dengan fitur-fitur ISP skala nasional.

---

## 📝 Kronologi Perubahan (Changelog)

### [v2.0.0-alpha.1] - Tahap Inisialisasi Patch
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Evaluasi infrastruktur Next.js App Router saat ini.
- [x] Mengidentifikasi komponen kritis eksisting (`LanguageContext.js`, `/admin`, layouting dasar).
- [x] Membuat dokumen `FRONTEND_CHANGELOG.md` ini untuk melacak setiap modifikasi sekecil apapun demi kehati-hatian (Safety).

### [v2.0.0-alpha.2] - Virtual NOC Dashboard
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Menambahkan rute & UI baru untuk **NOC Dashboard** di `src/app/admin/noc/page.js`.
- [x] Menerapkan desain *Glassmorphism*, palet warna *Premium Dark Mode*, dan indikator kesehatan (*Network OK* status).
- [x] Menyuntikkan menu 'NOC Dashboard' ke dalam arsitektur `src/app/admin/layout.js`.
- [x] Memperbarui izin kontrol akses (*RBAC Settings*) di frontend agar role `ADMIN` dan `NOC` dapat melihat menu ini.

### [v2.0.0-alpha.3] - AI Predictive Engine & Global Omnisearch
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan **AI Predictive Dashboard** (`/admin/ai`) untuk mendeteksi anomali OLT dan Sesi PPPoE yang sering putus sebelum pelanggan komplain.
- [x] Mengintegrasikan menu *AI Predictive Engine* pada Sidebar `COMPANY -> Networking`.
- [x] Mengaktifkan fitur **Global Omnisearch Engine**: Modifikasi bilah pencarian Navbar (Ctrl+K ready) untuk membaca *query* dan mengarahkannya ke `/admin/search?q=`.
- [x] Membangun antarmuka Hasil Pencarian Universal (`/admin/search/page.js`) yang mengelompokkan temuan ke kategori CUSTOMER, BILLING, TICKET, PPPOE, ONU.

### [v2.0.0-alpha.4] - Disaster Recovery (DR) Dashboard
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Membangun halaman **Disaster Recovery & Failover** (`/admin/dr`).
- [x] Mengembangkan visualisasi arsitektur *Multi-Region Clustering* (Jakarta vs Singapura) dengan pantauan latensi, status Replikasi DB, dan lalu lintas (*Traffic Routing*) Real-Time.
- [x] Mendesain "Red Button" *Emergency Failover* yang diamankan dengan *Modal* konfirmasi kritis untuk memigrasikan Sesi PPPoE secara paksa saat terjadi pemadaman pusat data.
- [x] Mendaftarkan menu DR ke dalam bilah navigasi (Menu SYSTEM) dan menguncinya hanya untuk `SUPERADMIN`.

### [v2.0.0-alpha.5] - Penyelarasan Kamus Bahasa (Localization Fix)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Menganalisis percakapan dan memperbaiki potensi masalah pelokalan.
- [x] Menambahkan entri terjemahan untuk `noc_dashboard`, `ai_predictive_engine`, dan `disaster_recovery` di kamus Bahasa Indonesia (`id`) dan Bahasa Inggris (`en`) pada file `src/components/LanguageContext.js`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2 untuk memastikan menu-menu baru tampil secara lokal dengan nama menu yang tepat saat berganti bahasa.

### [v2.0.0-alpha.6] - Admin Dashboard UI
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Admin Dashboard** baru (`/admin/dashboard`) dalam file TypeScript (`src/app/admin/dashboard/page.tsx`).
- [x] Membuat komponen-komponen visual baru: `KpiCard.tsx`, `RevenueChart.tsx` (CSS bar graph), `AlertsPanel.tsx` (WebSocket log sim), dan `TechnicianTable.tsx`.
- [x] Merancang layout frame `AdminLayout.tsx` bersama dengan pembatasan hak akses (*RoleGuard.tsx* RBAC) yang hanya mengizinkan role `ADMIN`, `SUPERADMIN`, `OPERATOR`, `FINANCE`, dan `SALES`.
- [x] Memperbarui menu sidebar utama `layout.js` untuk mengarahkan item 'Dashboard' ke path `/admin/dashboard`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2 untuk memvalidasi seluruh berkas TypeScript baru.

### [v2.0.0-alpha.7] - Customer Dashboard UI
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Customer Dashboard** baru (`/customer/dashboard`) dalam file TypeScript (`src/app/customer/dashboard/page.tsx`).
- [x] Membuat komponen visual khusus pelanggan: `InternetStatus.tsx` (real-time pulse), `SignalCard.tsx` (rx optical link power), `InvoiceCard.tsx` (billing & Xendit portal redirect), `SubscriptionCard.tsx`, dan `TicketList.tsx` (riwayat aduan).
- [x] Merancang fitur interaktif **Speedtest** menggunakan Zustand store (`customerStore.ts`) dan react-query mutation (`useCustomerDashboard.ts`) untuk mensimulasikan uji unduh/unggah langsung dari ONT ke server terdekat.
- [x] Membungkus root layout (`ClientLayout.js`) dengan `QueryClientProvider` global untuk mencegah kegagalan prerender pada halaman statis Next.js yang menggunakan TanStack Query.
- [x] Memperbarui kondisi *isAppRoute* di `ClientLayout.js` agar menyembunyikan Navbar/Footer publik saat pelanggan mengakses rute `/customer/dashboard`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.8] - Technician Dashboard UI
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Technician Dashboard** baru (`/technician/dashboard`) dalam file TypeScript (`src/app/technician/dashboard/page.tsx`).
- [x] Membuat komponen-komponen visual teknisi lapangan: `WorkOrderList.tsx` (mutasi status perintah kerja), `TechnicianMap.tsx` (GPS tracker mock), `PendingTasks.tsx` (todo list tugas), dan `Schedule.tsx` (timeline agenda harian).
- [x] Merancang state global menggunakan Zustand (`technicianStore.ts`) dan *TanStack Query* mutations (`useTechnicianDashboard.ts`) untuk mendukung mutasi status pekerjaan teknisi (Pending ⇆ On Route ⇆ In Progress ⇆ Completed) secara dinamis.
- [x] Mengamankan modul portal teknisi dengan `RoleGuard` RBAC (hanya dapat diakses oleh `TEKNISI`, `ADMIN`, `SUPERADMIN`, dan `OPERATOR`).
- [x] Memperbarui kondisi *isAppRoute* di `ClientLayout.js` agar menyembunyikan Navbar/Footer publik saat rute `/technician/dashboard` diakses.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.9] - Virtual NOC Dashboard (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Virtual NOC Dashboard** baru (`/noc`) dalam file TypeScript (`src/app/noc/page.tsx`).
- [x] Membuat komponen visual pengawasan jaringan: `OltStatusGrid.tsx` (uptime & beban CPU/suhu), `OnuSignalChart.tsx` (distribusi redaman sinyal), `PppoeTable.tsx` (sesi aktif dari RADIUS), `NocAlerts.tsx` (log alarm real-time), dan `NocMap.tsx` (distribusi titik OLT/pelanggan/teknisi).
- [x] Merancang state global menggunakan Zustand (`nocStore.ts`) dan react-query query (`useNoc.ts`) untuk memantau data OLT, ONU, dan RADIUS secara langsung.
- [x] Menghapus berkas lawas JavaScript `admin/noc/page.js` untuk menghindari tabrakan perutean (routing collision) di Next.js.
- [x] Memperbarui menu sidebar utama `layout.js` untuk mengarahkan item 'NOC Dashboard' ke path `/noc`.
- [x] Memperbarui kondisi *isAppRoute* di `ClientLayout.js` agar menyembunyikan Navbar/Footer publik saat rute `/noc` diakses.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.10] - Billing & Payment UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Admin Billing & Keuangan** baru (`/admin/billing`) dalam file TypeScript (`src/app/admin/billing/page.tsx`).
- [x] Mengembangkan modul **Customer Billing** baru (`/customer/billing`) dalam file TypeScript (`src/app/customer/billing/page.tsx`).
- [x] Membuat komponen visual keuangan: `InvoiceTable.tsx` (tabel status pelunasan), `InvoiceDetail.tsx` (rincian item tagihan dan konfirmasi manual admin), dan `PaymentButton.tsx` (simulasi transaksi virtual account via Xendit).
- [x] Merancang query dan mutasi berbasis TanStack Query (`useBilling.ts`) untuk mengambil tagihan serta mengirim webhook konfirmasi manual.
- [x] Menghapus berkas JavaScript lama `src/app/admin/billing/page.js` untuk migrasi bersih ke TypeScript.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.11] - CRM & Ticketing UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Admin CRM & Leads Onboarding** baru (`/admin/crm`) dalam file TypeScript (`src/app/admin/crm/page.tsx`).
- [x] Mengembangkan modul **Admin Ticketing & SLA Tracker** baru (`/admin/ticket`) dalam file TypeScript (`src/app/admin/ticket/page.tsx`).
- [x] Membuat komponen visual CRM: `LeadsTable.tsx` (tabel corong penjualan) dan `CustomerDetail.tsx` (panel parameter jaringan & profil bandwidth).
- [x] Membuat komponen visual Ticketing: `TicketList.tsx` (daftar gangguan aktif), `TicketDetail.tsx` (rincian keluhan & alokasi teknisi), dan `SlaTimer.tsx` (hitung mundur SLA real-time).
- [x] Merancang query dan mutasi berbasis TanStack Query (`useCrm.ts` & `useTicket.ts`) untuk mengambil data prospek, tiket keluhan, dan mengirim mutasi perubahan alokasi tugas.
- [x] Memperbarui menu sidebar utama `layout.js` untuk mengarahkan item 'Tickets Dashboard' ke path `/admin/ticket` dan 'Leads Dashboard' ke path `/admin/crm`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.12] - Config Orchestration UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Config Orchestration** baru (`/admin/config`) dalam file TypeScript (`src/app/admin/config/page.tsx`).
- [x] Membuat komponen visual editor: `TemplateList.tsx` (daftar template target), `TemplateEditor.tsx` (editor teks kode dengan layout gelap premium), `DiffViewer.tsx` (peninjau perbedaan perubahan baris demi baris), `ExecutionLog.tsx` (tabel log aktivitas eksekusi & tombol rollback), dan `ApplyTemplateModal.tsx` (pop-up dialog konfirmasi pengiriman konfigurasi).
- [x] Merancang query dan mutasi TanStack Query (`useConfig.ts`) untuk mendukung alur deployment konfigurasi dan aksi pembatalan (rollback).
- [x] Memperbarui menu sidebar utama `layout.js` untuk mengarahkan item 'Konfigurasi' ke path `/admin/config`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.13] - AI Predictive & AI Traffic UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **AI Predictive Engine** baru (`/admin/ai/predictive`) dalam file TypeScript (`src/app/admin/ai/predictive/page.tsx`).
- [x] Mengembangkan modul **AI Traffic Analyzer** baru (`/admin/ai/traffic`) dalam file TypeScript (`src/app/admin/ai/traffic/page.tsx`).
- [x] Membuat komponen visual cerdas: `RiskScore.tsx` (skor tingkat probabilitas kegagalan koneksi), `PredictionChart.tsx` (proyeksi tren risiko gangguan 5 hari kedepan), `TrafficChart.tsx` (grafik beban trafik peladen & lonjakan paket real-time), dan `AnomalyTable.tsx` (tabel deteksi serangan cyber DDoS & aktivitas IP scanning tak wajar).
- [x] Merancang query terstruktur berbasis TanStack Query (`useAi.ts`) untuk mengambil estimasi risiko per pelanggan dan log anomali bandwidth.
- [x] Menghapus berkas lama JavaScript `src/app/admin/ai/page.js` untuk mengalihkan ke sub-page terstruktur.
- [x] Memperbarui rincian item submenu sidebar utama `layout.js` dan pengaturan hak akses peran (RBAC) agar mendukung menu individual `AI Predictive` dan `AI Traffic`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.14] - Multi-Tenant SaaS UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Multi-Tenant SaaS Manager** baru (`/admin/tenant`) dalam file TypeScript (`src/app/admin/tenant/page.tsx`).
- [x] Membuat komponen visual manajemen multi-tenant: `TenantList.tsx` (daftar entitas anak perusahaan/mitra), `TenantDetail.tsx` (panel rincian profil & kelola daur hidup aktif/suspend), `TenantResources.tsx` (progress limit alokasi sesi PPPoE, ONT ONU terdaftar, & kapasitas uplink trunk), dan `TenantBilling.tsx` (informasi lisensi paket langganan SaaS & status penagihan).
- [x] Merancang query dan mutasi berbasis TanStack Query (`useTenant.ts`) untuk mengambil informasi daftar tenant dan memperbarui status suspensi daur hidup tenant.
- [x] Memperbarui menu sidebar utama `layout.js` bagian sistem dan pengaturan hak akses role `ADMIN` agar merender navigasi `Multi-Tenant SaaS` ke `/admin/tenant`.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.

### [v2.0.0-alpha.15] - Landing Page UI (TSX)
**Tanggal**: 16 Juli 2026
**Tindakan**:
- [x] Mengembangkan modul **Landing Page** baru (`/`) dalam file TypeScript (`src/app/page.tsx`).
- [x] Membuat komponen visual publik landing page: `Hero.tsx` (seksi hero dengan desain modern), `PaketGrid.tsx` (grid paket internet fiber optik untuk segmentasi retail rumahan maupun enterprise), `CoverageChecker.tsx` (panel cek area wilayah jangkauan FTTH), `PromoBanner.tsx` (banner penawaran terbatas hemat persentase discount), dan `Footer.tsx` (tautan hukum, kontak bantuan resmi & referensi domain topclass.id).
- [x] Menghapus berkas lama JavaScript `src/app/page.js` untuk migrasi bersih ke TypeScript.
- [x] Melakukan kompilasi ulang (Next.js Build) dan restart PM2.
