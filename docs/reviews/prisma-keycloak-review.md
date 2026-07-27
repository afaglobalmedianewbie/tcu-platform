# Laporan Peninjauan Teknis: Prisma & Keycloak Draft

**Peran:** Senior Technical Reviewer & Production Safety Engineer
**Proyek:** TCU Platform
**Tanggal:** 2026-07-14

## 1. Ringkasan Ulasan (Review Summary)
Secara keseluruhan, arsitektur yang dirancang untuk transisi dari sistem autentikasi lokal ke Keycloak SSO sudah direncanakan dengan baik. Terdapat pemisahan yang jelas antara identitas (Keycloak) dan data profil pelanggan (PostgreSQL). Namun, ditemukan beberapa **risiko fatal** terkait duplikasi konsep arsitektur, inkonsistensi pedoman merek (branding), serta potensi kehilangan data pada skema basis data yang harus segera diatasi sebelum draf ini dapat dimasukkan ke fase *staging* atau *production*.

*Catatan: Berkas `docs/prisma/prisma-phase-plan.md` tidak ditemukan dalam direktori, sehingga peninjauan fase didasarkan pada dokumen pemetaan.*

## 2. Isu Kritis (Critical Issues)

1. **Duplikasi Konsep Peran & Izin (Duplicate RBAC Concepts)**
   - **Lokasi:** `schema.tcu-platform.draft.prisma` (Modul 01) vs `prisma-keycloak-mapping.md`
   - **Masalah:** Dokumen pemetaan menyatakan bahwa Keycloak adalah *Source of Truth* untuk peran (Role), dan backend akan menggunakan `realm_access.roles` dari JWT. Namun, draf skema Prisma masih mendefinisikan tabel `Role`, `Permission`, `UserRole`, dan `RolePermission` secara ekstensif. Ini akan menyebabkan konflik sumber kebenaran (*split-brain*) dan *overhead* sinkronisasi yang rumit.

2. **Pelanggaran Aturan Merek / Domain (Branding Constraint Violation)**
   - **Lokasi:** `tcu-platform-realm.draft.json`
   - **Masalah:** *Redirect URIs* dan *Web Origins* pada konfigurasi *client* menggunakan `topclassuniversal.co.id` (misal: `https://app.topclassuniversal.co.id/*`). Sesuai **Aturan Ruang Kerja #15**, domain resmi yang wajib digunakan untuk aplikasi TCU Platform adalah `topclass.id`.

3. **Penghapusan Kaskade yang Berbahaya (Dangerous Cascade Deletes)**
   - **Lokasi:** `schema.tcu-platform.draft.prisma` -> Model `Customer`
   - **Masalah:** Relasi `user User @relation(fields: [userId], references: [id], onDelete: Cascade)` sangat berbahaya untuk sistem *billing* dan CRM. Menghapus data akun login (`User`) akan serta-merta menghapus data Pelanggan (`Customer`). Ini dapat merusak rekam jejak faktur (*Invoice*), pembayaran, dan audit secara permanen.

## 3. Perbaikan yang Direkomendasikan (Recommended Fixes)

1. **Konsolidasi RBAC:** 
   Hapus model `Role`, `Permission`, `UserRole`, dan `RolePermission` dari skema Prisma jika Keycloak sepenuhnya bertugas mengurus izin. Alternatifnya, sederhanakan menjadi kolom `roles String[]` pada tabel `User` sebagai *cache* semata, bukan relasi.
2. **Koreksi Domain SSO:** 
   Perbarui berkas `tcu-platform-realm.draft.json` agar *Redirect URIs* mengarah ke `https://admin.topclass.id/*`, `https://customer.topclass.id/*`, dan `https://tech.topclass.id/*` sesuai pedoman merek.
3. **Penerapan *Soft Delete*:** 
   Ubah `onDelete: Cascade` menjadi `onDelete: Restrict` atau `SetNull` pada entitas finansial dan pengguna (seperti `Customer` ke `User`). Gunakan status enumerasi (misal `UserStatus.INACTIVE` / `CustomerStatus.TERMINATED`) alih-alih penghapusan fisik.

## 4. Model yang Disetujui untuk Fase 1 (Phase 1 Approved Models)
Model-model ini dianggap aman dan memiliki relasi yang terstruktur dengan baik untuk diterapkan pada fondasi awal:
- `User` (dengan tambahan `keycloakId` sudah tepat)
- `AuditLog` (sangat direkomendasikan untuk keamanan pelacakan)
- `Customer` (dengan syarat perbaikan isu kaskade)
- Entitas layanan utama (`ServicePackage`, dll)

## 5. Model yang Ditunda untuk Fase 2 (Phase 2 Delayed Models)
- **Tabel Otorisasi Internal (`Role`, `Permission`, `UserRole`, `RolePermission`)**: Ditunda dan dikembalikan ke tahap desain untuk diselaraskan kembali dengan kapabilitas peran Keycloak.

## 6. Pemblokir Deployment Keycloak (Keycloak Deployment Blockers)
- Konfigurasi *Realm JSON* tidak valid akibat penggunaan domain kadaluwarsa (`topclassuniversal.co.id`). Harus diperbaiki menjadi `topclass.id` sebelum Keycloak dideploy.
- Ketidakjelasan apakah implementasi Middleware pada backend API (Node.js) telah disiapkan untuk menangani sistem "Multi-Auth" (Bcrypt JWT lokal + Keycloak OIDC JWT) selama masa migrasi.

## 7. Rekomendasi Akhir (Final Recommendation)
**DITOLAK (REJECTED FOR MIGRATION).** 
Jangan buat atau jalankan berkas migrasi Prisma (SQL) dan jangan deploy kontainer Keycloak saat ini. Harap perbaiki arsitektur penghapusan kaskade pada skema Prisma, sesuaikan domain pada konfigurasi Realm, dan bersihkan duplikasi fungsionalitas RBAC sebelum mengajukan peninjauan ulang.
