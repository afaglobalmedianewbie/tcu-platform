# Pemetaan Identitas: Prisma (PostgreSQL) ke Keycloak

Dokumen ini menjelaskan strategi integrasi dan pemetaan data identitas antara skema database lokal (diatur melalui Prisma ORM) dan Keycloak sebagai Identity Provider untuk TCU Platform.

---

## 1. Data yang Dipertahankan di PostgreSQL (Prisma)
Keycloak hanya berfungsi sebagai sistem autentikasi, bukan sebagai sistem HR atau CRM. Oleh karena itu, data profil dan bisnis tetap berada di PostgreSQL:
- **Data Profil Dasar**: Nama depan, nama belakang, nomor telepon, alamat.
- **Relasi Bisnis**: `branch_id`, `area_id`, `department_id`.
- **Status Operasional**: Flag `is_active`, `deleted_at` (soft delete), `created_at`, `updated_at`.
- **Relasi Entitas Khusus**: ID yang menautkan entitas `User` ke tabel `Customer`, `Technician`, atau `Employee`.

## 2. Data Identitas yang Dikelola oleh Keycloak
Keycloak akan menjadi *Source of Truth* tunggal untuk kredensial dan status autentikasi:
- **Kredensial Login**: Password hashes, konfigurasi OTP/MFA, WebAuthn.
- **Identitas Login Utama**: `email` (sebagai username/login utama) dan `username` unik.
- **Siklus Hidup Akun**: Status akun terkunci (Brute Force lockout), email verification status, dan "Required Actions" (seperti wajib reset password).
- **Session Management**: Daftar sesi aktif pengguna, IP login, dan *refresh tokens*.

## 3. Pemetaan Tabel User Lokal ke Subject ID Keycloak
Untuk menautkan pengguna di Keycloak dengan pengguna di PostgreSQL, kita akan menggunakan klaim `sub` (Subject ID) dari Keycloak JWT.
- **Perubahan Skema Prisma**: Tabel `User` akan ditambahkan kolom baru:
  ```prisma
  model User {
    id          String   @id @default(uuid()) // Internal ID
    keycloak_id String?  @unique              // Keycloak 'sub' ID
    email       String   @unique
    // ... field lainnya
  }
  ```
- **Alur Login**: Saat token diterima oleh backend, middleware akan mencari pengguna berdasarkan `keycloak_id`. Jika tidak ditemukan (kasus migrasi), ia akan mencocokkan berdasarkan `email` lalu menyimpan `sub` dari Keycloak ke dalam kolom `keycloak_id`.

## 4. Sinkronisasi Role (Peran)
- Keycloak adalah pengelola otoritas (Source of Truth) untuk **Role**.
- Role dikonfigurasi di Keycloak menggunakan *Realm Roles* (misal: `admin`, `finance`, `customer`).
- **Sinkronisasi**: Backend tidak menyimpan role di PostgreSQL secara statis. Sebagai gantinya, middleware membaca klaim `realm_access.roles` langsung dari JWT setiap kali request API masuk.
- Jika antarmuka lokal memerlukan cache role (misal untuk rendering UI yang cepat), role dapat diekstrak saat login dan disimpan dalam sesi redis atau JSON lokal yang bersifat sementara.

## 5. Pemeriksaan Izin (Permissions) oleh Backend
1. **Validasi Signature**: Backend Express memvalidasi JWT dari sisi klien menggunakan *Public Key* (JWKS) dari Keycloak.
2. **Ekstraksi Klaim**: Middleware mengekstrak klaim standar (`sub`, `email`) dan klaim khusus (`roles`, `permissions` jika dikonfigurasi melalui Keycloak Protocol Mappers).
3. **Enforcement (RBAC)**: Backend menggunakan fungsi middleware seperti `requireRole('finance')`. Middleware ini akan menolak akses (403 Forbidden) jika role tersebut tidak ada di dalam list `roles` yang didekode dari JWT.

## 6. Penanganan Pengguna Pelanggan (Customer Users)
- **Role Keycloak**: Mendapatkan role khusus `customer`.
- **Relasi Prisma**: Di tabel `User`, mereka memiliki relasi *One-to-One* dengan model `Customer`.
- **Isolasi Data**: Saat pelanggan memanggil API, backend mengambil `customer_id` yang tertaut dengan `user_id` mereka, lalu secara otomatis menyuntikkan filter `where: { customerId: currentCustomerId }` ke dalam setiap kueri Prisma untuk menjamin data pelanggan tidak bocor ke pelanggan lain.

## 7. Penanganan Pengguna Teknisi (Technician Users)
- **Role Keycloak**: Mendapatkan role `technician`.
- **Relasi Prisma**: Ditautkan ke model `Technician` (berisi keahlian, status ketersediaan, area operasional).
- **Atribut Khusus**: Jika perlu, Keycloak dapat dikonfigurasi untuk menyertakan `area_id` dalam JWT (sebagai *User Attribute*), sehingga backend dapat langsung memfilter *Work Order* berdasarkan area teknisi tanpa kueri tambahan ke database.

## 8. Pencatatan Log Audit (Authentication Source)
- Model Prisma `AuditLog` atau `ActivityLog` akan mencatat setiap tindakan krusial.
- **Kolom Baru**: Tambahkan kolom `auth_source` (Enum: `LOCAL_JWT`, `KEYCLOAK`, `SYSTEM_CRON`) pada skema log.
- **Tujuan**: Membedakan tindakan yang dilakukan melalui sistem login lama (selama fase transisi) dan tindakan melalui Keycloak, serta membantu dalam pelacakan insiden keamanan.

## 9. Migrasi dari Pengguna JWT (Existing) ke Pengguna Keycloak
Hash kata sandi bcrypt yang ada mungkin tidak bisa diimpor secara langsung ke Keycloak tanpa pengembangan Custom Password Hash Provider. Oleh karena itu, strategi migrasinya adalah:
1. **Ekspor Data**: Skrip menarik daftar `email`, `firstName`, dan `lastName` dari PostgreSQL.
2. **Impor ke Keycloak**: Menggunakan Keycloak Admin REST API untuk membuat user baru **tanpa** password.
3. **Required Action**: User yang diimpor disetel dengan Required Action `UPDATE_PASSWORD`.
4. **Pengalaman Pengguna**: Saat pengguna mencoba login untuk pertama kalinya via SSO, Keycloak akan meminta mereka membuat password baru. Setelah berhasil, pengguna diredirect kembali ke sistem, dan backend akan mengikat `keycloak_id` ke record mereka di PostgreSQL.

## 10. Rencana Rollback jika Keycloak Dinonaktifkan (Failback)
Jika integrasi Keycloak mengalami kegagalan sistemik atau dibatalkan:
1. **Pertahankan `password_hash`**: Jangan menghapus kolom `password_hash` bcrypt lama dari skema Prisma selama masa migrasi.
2. **Fallback Endpoint**: Endpoint login legacy (`/api/auth/login`) dipertahankan tetapi disembunyikan/dinonaktifkan sementara di UI.
3. **Eksekusi Rollback**: Cukup mengubah variabel environment frontend untuk mengarahkan halaman login kembali ke form login lokal alih-alih redirect ke Keycloak.
4. **Pemulihan Kredensial**: Pengguna baru yang mendaftar sepenuhnya di Keycloak selama masa integrasi tidak akan memiliki `password_hash` di PostgreSQL. Jika rollback terjadi, mereka harus menggunakan fitur "Lupa Kata Sandi" pada sistem lokal untuk membuat hash bcrypt baru.
