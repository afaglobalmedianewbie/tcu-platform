# Rencana Basis Data Staging: TCU Platform

**Peran:** Senior Database Migration Planner
**Status:** Draf / Persiapan
**Tanggal:** 2026-07-14

---

## 1. Arsitektur Basis Data Staging
Basis data staging dirancang khusus untuk menguji coba pembaruan skema Prisma secara terisolasi tanpa menyentuh *instance* PostgreSQL produksi (`tcu-db`). Staging ini sepenuhnya terpisah baik dari sisi penyimpanan fisik, manajemen pengguna, nama basis data, maupun lapisan jaringannya.

- **Staging Container:** `tcu-db-staging`
- **Database Name:** `tcu_platform_staging`
- **Staging User:** `tcu_staging_user`
- **Storage Volume:** Diikat (*bind mount*) secara fisik ke folder independen lokal `./data/staging/postgres`.
- **Port Jaringan:** Khusus di-bind ke `localhost` pada port yang dimodifikasi (`127.0.0.1:55432:5432`). Mencegah akses masuk dari antarmuka eksternal di tingkat jaringan.

---

## 2. Draf Konfigurasi Docker (`docker-compose.staging-db.yml`)

Berkas mandiri ini hanya memuat layanan untuk menjalankan basis data staging (bukan untuk dijalankan sekarang).

```yaml
version: '3.8'

services:
  tcu-db-staging:
    image: postgres:15-alpine
    container_name: tcu-db-staging
    restart: unless-stopped
    ports:
      # Bind HANYA ke localhost (127.0.0.1) untuk mencegah eksposur dari luar
      - "127.0.0.1:55432:5432"
    environment:
      POSTGRES_DB: ${STAGING_DB_NAME}
      POSTGRES_USER: ${STAGING_DB_USER}
      POSTGRES_PASSWORD: ${STAGING_DB_PASSWORD}
    volumes:
      - ./data/staging/postgres:/var/lib/postgresql/data
    networks:
      - tcu_staging_net

networks:
  tcu_staging_net:
    driver: bridge
```

---

## 3. Penambahan Variabel Lingkungan (`.env`)

Kredensial berikut disiapkan untuk di-copy ke berkas `.env` aplikasi nantinya. Sesuai aturan kerja, tidak ada tanda kutip untuk nilai *environment variables*.

```env
# ========================================
# DATABASE STAGING (DO NOT CONNECT TO PROD)
# ========================================
STAGING_DB_NAME=tcu_platform_staging
STAGING_DB_USER=tcu_staging_user
STAGING_DB_PASSWORD=staging_super_secret_password_123

# Prisma connection URL khusus untuk staging:
DATABASE_URL_STAGING=postgresql://tcu_staging_user:staging_super_secret_password_123@127.0.0.1:55432/tcu_platform_staging?schema=public
```

---

## 4. Perintah Validasi (Validation Commands)

Instruksi pengujian (*checklist*) yang harus dijalankan **hanya setelah** instruksi `docker compose up` dilakukan di masa mendatang, demi memastikan basis data berhasil berjalan di lingkup lokal.

```bash
# 1. Pastikan kontainer tcu-db-staging aktif berjalan
docker ps | grep tcu-db-staging

# 2. Pastikan kontainer produksi (tcu-db) tetap berjalan tanpa gangguan (port 5432)
docker ps | grep tcu-db

# 3. Uji interaksi ke dalam PostgreSQL staging tanpa menabrak produksi
docker exec -it tcu-db-staging psql -U tcu_staging_user -d tcu_platform_staging -c "\conninfo"
```

---

## 5. Perintah Pengembalian (Rollback Commands)

Jika di tengah pengujian terjadi skema migrasi yang gagal fatal, Anda dapat dengan mudah menghapus staging tanpa memengaruhi sistem *live*.

```bash
# 1. Hentikan layanan dan hapus kontainer/jaringan staging
docker-compose -f docker-compose.staging-db.yml down

# 2. Hapus penyimpanan fisik untuk mereset seluruh data staging kembali nol
sudo rm -rf ./data/staging/postgres
```

---

## 6. Catatan Risiko Keselamatan (Risk Notes)

1. **Prisma URL Override:** Saat menjalankan perintah `prisma migrate` atau `prisma db push` kelak, Anda **wajib** mengubah sementara `DATABASE_URL` di `.env` (atau melalui parameter CLI ekspor sementara) menunjuk ke `DATABASE_URL_STAGING`. Jika lupa, migrasi skema draf Anda akan otomatis mengacaukan struktur produksi.
2. **Kekosongan Data:** Staging ini dirancang kosong sejak instalasi awal. Saat ini, dilarang menjalankan *pg_dump* dari database produksi karena ada kekhawatiran skema relasi dan kaskade pelacakan belum beres.
3. **Isolasi Jaringan:** Jaringan *bridge* lokal dinamakan `tcu_staging_net`. Kontainer ini tidak dirutekan ke `app_net` produksi. Artinya, _backend_ produksi (`tcu-backend`) tidak akan pernah bisa keliru menulis (*write*) ke staging, begitu pula sebaliknya.
