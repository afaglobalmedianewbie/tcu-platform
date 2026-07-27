# 📘 Pusat Dokumentasi & SOP - TCU Platform

Selamat datang di **Knowledge Base & Wiki Internal PT Top Class Universal (topclass.id)**. Dokumen ini merangkum seluruh arsitektur sistem, infrastruktur jaringan, tata kelola mail server, serta mekanisme otomasi yang aktif pada server produksi saat ini.

---

## 🗺️ Daftar Isi
* [1. Arsitektur Utama & Stack Deployment](#1-arsitektur-utama--stack-deployment)
* [2. Jaringan & Keamanan Administratif](#2-jaringan--keamanan-administratif)
* [3. Layanan Email (Mail Server & Webmail)](#3-layanan-email-mail-server--webmail)
* [4. Sistem Monitoring & Log Audit Super Admin](#4-sistem-monitoring--log-audit-super-admin)
* [5. Otomasi Konten (AI Blog & Wiki Autopost)](#5-otomasi-konten-ai-blog--wiki-autopost)
* [6. Dukungan Multibahasa (Localization / I18n)](#6-dukungan-multibahasa-localization--i18n)

---

## 1. Arsitektur Utama & Stack Deployment

Sistem TCU Platform dirancang menggunakan arsitektur modular yang memisahkan frontend, backend, dan basis data:

| Komponen | Teknologi | Port Lokal | Mode Deployment | Keterangan |
| :--- | :--- | :---: | :--- | :--- |
| **Frontend** | Next.js 16 (Turbopack) | `3001` | PM2 / Docker Container | Akses publik via Nginx Proxy |
| **Backend API** | Node.js Express + Prisma ORM | `3000` | Docker Container | Akses internal & API sub-domain |
| **Database** | PostgreSQL 15 | `5432` | Docker Container | Dibatasi ke localhost & VPN |
| **Reverse Proxy** | Nginx OpenSSL | `80` / `443` | Native Ubuntu Service | SSL otomatis dikelola Certbot |
| **VPN Admin** | WG-Easy (WireGuard) | `51820` / `51821` | Docker Container | Digunakan untuk interkoneksi admin |

### File Konfigurasi Inti:
* **Docker Setup**: [docker-compose.yml](file:///home/tcu/docker-compose.yml)
* **Nginx Config**: [/etc/nginx/sites-available/topclassuniversal.co.id.conf](file:///etc/nginx/sites-available/topclassuniversal.co.id.conf)
* **Laporan Alur Data (PDF)**: [laporan-tcuplatform.pdf](file:///home/tcu/tcu-wiki/public/laporan-tcuplatform.pdf) (Tautan Unduh: [Unduh Laporan](http://wiki.topclassuniversal.co.id/laporan-tcuplatform.pdf))

---

## 2. Jaringan & Keamanan Administratif

### A. Cloudflare Tunnel (`cloudflared`)
* **Pola Akses**: `cloudflared` (Client v2026.7.1) dikonfigurasi **hanya** untuk mengamankan akses administratif sensitif (seperti database PostgreSQL, SSH, dan Dashboard WG-Easy VPN).
* **Trafik Publik**: Trafik untuk situs utama `topclassuniversal.co.id` tetap melewati **Nginx Direct IP** (tanpa Cloudflare Tunnel) untuk menjaga latensi tetap rendah dan efisiensi bandwidth ISP lokal.

### B. Interkoneksi Perangkat (Mikrotik & OLT)
* **Keamanan**: Tidak ada panggilan API HTTP langsung ke Mikrotik dari luar. Semua koneksi data menuju Mikrotik/OLT dienkripsi di dalam **VPN Tunnel**.
* **Autentikasi**: Autentikasi pelanggan PPPoE/Hotspot diproses menggunakan server **FreeRADIUS** yang terhubung melalui VPN Tunnel.
* **Manajemen ONT/Modem**: Menggunakan **GenieACS (TR-069)** atau protokol SNMP yang berjalan di atas VPN untuk konfigurasi otomatis perangkat pelanggan.

---

## 3. Layanan Email (Mail Server & Webmail)

Sistem surat elektronik dikelola secara mandiri pada server lokal menggunakan integrasi Postfix, Dovecot (IMAP/POP3/LMTP), MySQL, dan Roundcube:

```
                  [ Internet (DNS MX: mail.topclassuniversal.co.id) ]
                                      |
                                      v
                               [ Postfix MTA ]
                                      | (LMTP Socket: private/dovecot-lmtp)
                                      v
                               [ Dovecot LMTP ]
                                      | (Virtual Delivery UID/GID: 5000)
                                      v
                               [ Kotak Surat (/var/vmail/%d/%n) ]
                                      ^
                                      | (IMAP SSL / POP3 TLS)
                              [ Roundcube Webmail ]
```

### A. Subdomain, Port & Firewall
* **Domain Utama**: `mail.topclassuniversal.co.id`
* **Protokol Aktif**:
  * **SMTP**: Port `25` (Standard SMTP), Port `587` (Submission STARTTLS), dan Port `465` (SMTPS TLS/SSL).
  * **IMAP**: Port `143` (Standard IMAP STARTTLS) dan Port `993` (IMAPS Secure).
  * **POP3**: Port `110` (Standard POP3 STARTTLS) dan Port `995` (POP3S Secure).
* **Firewall (UFW)**: Seluruh port di atas (`25`, `465`, `587`, `110`, `143`, `993`, `995`) telah dibuka secara terbuka untuk akses eksternal yang aman.
* **Keamanan**: Diproteksi menggunakan sertifikat SSL Let's Encrypt dari `/etc/letsencrypt/live/topclassuniversal.co.id/`.

### B. Webmail Client: Roundcube Webmail (v1.6.6)
* **Lokasi Root**: `/var/www/mail.topclassuniversal.co.id`
* **Database**: Roundcube menggunakan basis data MySQL `roundcubemail` dengan user `roundcube`.
* **Konfigurasi**: File konfigurasi utama berada di `config/config.inc.php` dan telah diatur untuk menggunakan IMAP (`127.0.0.1:143`) serta SMTP (`127.0.0.1:25`) secara lokal.

### C. Integrasi Postfix & Dovecot (LMTP Delivery)
* **Penyimpanan Mailbox**: Menggunakan format `maildir` di `/var/vmail/%d/%n` (misal: `/var/vmail/topclassuniversal.co.id/admin/`).
* **Integrasi LMTP**: Postfix dikonfigurasi untuk melakukan delivery langsung ke Dovecot via LMTP socket (`virtual_transport = lmtp:unix:private/dovecot-lmtp` di `/etc/postfix/main.cf`). Sisi Dovecot mendengarkan pada socket tersebut lewat `10-master.conf`.
* **Database Driver**: MySQL (tabel `email_aliases` di DB `topclass_portal` dibaca oleh user `mailreader`).
* **Authentication Scheme**: Menggunakan `MD5-CRYPT` untuk password hashing dengan SSL DH parameter 2048-bit (`dh.pem` di `/etc/dovecot/dh.pem`) terpasang di Dovecot `10-ssl.conf` untuk mencegah kegagalan TLS handshake.
* **Resolusi Lokal**: `/etc/hosts` mengarahkan `mail.topclassuniversal.co.id` ke loopback `127.0.0.1` agar webmail lokal tidak merutekan lalu lintas IMAP/SMTP ke IP eksternal.

### D. Konfigurasi OpenDKIM & Proteksi Anti-Spam
Untuk menjamin email yang dikirim dari server TCU Platform tidak masuk ke folder SPAM penerima (seperti Gmail, Yahoo, dll.), sistem diintegrasikan dengan protokol **SPF (Sender Policy Framework)**, **DKIM (DomainKeys Identified Mail)**, dan **DMARC (Domain-based Message Authentication, Reporting, and Conformance)**.

#### 1. Integrasi Postfix & OpenDKIM Milter
Postfix dikonfigurasi untuk melewatkan seluruh email keluar melalui milter OpenDKIM pada port `8891` agar secara otomatis ditandatangani dengan kunci privat domain pengirim. Konfigurasi ini aktif di `/etc/postfix/main.cf`:
```postfix
milter_default_action = accept
milter_protocol = 6
smtpd_milters = inet:127.0.0.1:8891
non_smtpd_milters = inet:127.0.0.1:8891
```

#### 2. Konfigurasi Pengamanan OpenDKIM (`/etc/opendkim.conf`)
* **UserID**: Dikonfigurasi menggunakan `UserID opendkim` agar OpenDKIM berjalan di bawah hak akses user `opendkim` (sebelumnya terjadi error karena default berjalan sebagai `nobody` yang tidak memiliki akses membaca file kunci).
* **Pemeriksaan Kunci Aman**: Ditambahkan parameter `RequireSafeKeys false` untuk mencegah error pemuatan kunci jika terdapat ketidaksesuaian uid (misalnya file key dimiliki user `opendkim` tetapi proses dimulai oleh `root` (uid 0) sebelum drop privilege).
* **Hak Akses Direktori**: Direktori kunci `/etc/opendkim/` dan `/etc/opendkim/keys/` diatur dengan kepemilikan `root:root` dan izin akses `755` agar tidak dinilai sebagai folder yang "tidak aman" (writeable oleh user non-root). File kunci privat (`mail.private`) tetap dimiliki oleh `opendkim:opendkim` dengan izin akses `600` (hanya dibaca oleh OpenDKIM).

#### 3. Temuan Kritis: Bug Karakter Backspace (`\010`) pada DNS Record Publik
> [!WARNING]
> **TEMUAN KRITIS**: Berdasarkan hasil audit DNS, DNS TXT Record publik untuk sub-domain **`mail._domainkey.topclassuniversal.co.id`** saat ini **terkorup/rusak**. 
> Record tersebut mengandung karakter **backspace (`\010` dalam representasi oktal)** di beberapa tempat yang merusak string kunci publik DKIM (Base64) saat di-decode oleh mail server penerima.

* **Dampak**: Mail server penerima (seperti Gmail) gagal memverifikasi tanda tangan DKIM email dari `@topclassuniversal.co.id` karena kunci publik di DNS tidak cocok/tidak valid, menyebabkan email **langsung masuk ke folder SPAM**.
* **Langkah Solusi**: Administrator harus memperbarui DNS TXT Record publik untuk domain `topclassuniversal.co.id` melalui panel DNS hosting (seperti Cloudflare atau domain registrar). Hapus record lama dan ganti dengan record baru berikut:
  * **Name/Host**: `mail._domainkey`
  * **Type**: `TXT`
  * **Value / Text**: (masukkan string berikut secara utuh tanpa spasi tambahan, newline, atau karakter backspace):
    ```text
    v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvasn6xCbxaY96J9x1bgos1vFLcmFMAI1zaoWP2ILsdTFf3PZSTfaPLh1wTRWzZJFRnw0SkNDn6H2xUTY0NhgRyMHlonHzRHrzO7R0vmpPLuOkGwXfXuUCwTCE7BZIlbgBnONETBm/iYBBcMlQU8rbb/MGY8IcF40IpGLPz0GyBDlUANdeLGCH2h2aa9iAqOhsQZElYDo9qgk/MQupJQVCjn74IVfick0shdnrMfDYDnokvMw9YbGhtAL1151SyryYkeAkCIi72HTBma2vSzrNSUDgzmr4LzVXqCAiq48rtY0Sw5Tpks0e0F2vI1DxsBIssnKDfXZerQj+ACbR41ejwIDAQAB
    ```

* **Status Verifikasi Domain Lain**: Kunci DKIM untuk domain **`topclass.id`** (`mail._domainkey.topclass.id`) dikonfirmasi **aman dan valid** di DNS publik (tidak mengandung karakter rusak).


---

## 4. Sistem Monitoring & Log Audit Super Admin

Visualisasi performa server dan log aktivitas terintegrasi langsung pada **Dashboard Super Admin** (`/admin`):

### A. Endpoint API Monitoring (`server.js`)
* **`GET /api/admin/system/stats`**: Memindai beban CPU, penggunaan memori RAM (GB terpakai vs total), ruang kosong Disk utama `/`, jumlah koneksi jaringan TCP, dan daftar Docker Container aktif beserta statusnya secara langsung.
* **`GET /api/admin/audit`**: Menarik data log audit mutasi data terbaru dari database PostgreSQL (tabel `AuditLog`).

### B. Tampilan Visual Dashboard
* Halaman utama admin (`/admin/page.js`) menampilkan bilah indikator grafis (*Progress Bar*) performa RAM, CPU, dan status kontainer Docker secara langsung yang diperbarui otomatis setiap 15 detik.
* Halaman audit (`/admin/audit/page.js`) menyediakan portal pencarian log dinamis, pengelompokan level bahaya (`DELETE` / Gagal), serta ekspor data berformat CSV.

---

## 5. Otomasi Konten (AI Blog & Wiki Autopost)

Sistem penulisan konten otomatis dijalankan secara rutin melalui penjadwalan Linux Cron Job:

```bash
# Setiap hari pukul 09:00 WIB - Menulis Artikel Blog Baru menggunakan AI Studio
0 9 * * * curl -s -X POST -H 'Authorization: Bearer TCUSecretKey123' http://localhost:3001/api/autopost >> /home/tcu/autopost.log 2>&1

# Setiap hari pukul 09:15 WIB - Menulis Catatan Rilis & Panduan Wiki Baru
15 9 * * * curl -s -X POST -H 'Authorization: Bearer TCUSecretKey123' http://localhost:3001/api/wiki-autopost >> /home/tcu/wiki_autopost.log 2>&1
```

### Log File Lokasi:
* **Log Blog**: `/home/tcu/autopost.log`
* **Log Wiki**: `/home/tcu/wiki_autopost.log`

---

## 6. Dukungan Multibahasa (Localization / I18n)

Untuk mengakomodasi operasional global dan lokal, TCU Platform mengimplementasikan sistem lokalisasi (i18n) dinamis pada frontend Next.js:

* **Sistem Konteks**: Dikelola melalui berkas [LanguageContext.js](file:///home/tcu/frontend_new/src/components/LanguageContext.js) yang menyediakan fungsi penerjemah `t()` dan pemilih bahasa `LanguageSelector`.
* **Bahasa yang Didukung**:
  1. **Bahasa Indonesia (`id`)**: Bahasa default sistem untuk staf operasional lokal.
  2. **English (`en`)**: Bahasa internasional untuk standardisasi global.
* **Mekanisme Penyimpanan**: Pilihan bahasa pengguna disimpan secara stateless pada browser menggunakan `localStorage` dengan kunci `tcu_lang`.
* **Cakupan Dinamis**: Seluruh navigasi sidebar admin, judul halaman utama, status log audit, indikator performa, kartu KPI, serta menu administrasi email/webmail telah diterjemahkan sepenuhnya agar responsif terhadap pergantian bahasa secara real-time.

---

*Dokumentasi ini dipelihara secara aktif. Untuk memperbarui informasi di atas, silakan edit berkas `/home/tcu/tcu-wiki/public/README.md` pada sistem.*
