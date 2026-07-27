# Ringkasan Status Proyek & Kustomisasi Antigravity

Dokumen ini berisi rangkuman status terkini proyek Anda, konfigurasi agen yang telah dibuat, serta langkah-langkah berikutnya agar Anda dapat mengontrol penuh pekerjaan dengan hasil yang sempurna.

---

## 1. Arsitektur Proyek (TCU Platform)
Berdasarkan analisis file proyek (`PROJECT.md` & `GEMINI.md`), berikut adalah arsitektur yang aktif di server lokal Anda:
*   **Domain Utama**: `topclass.id`
*   **Frontend**: Next.js 16 berjalan di PM2 (Port `3001`). Proses PM2 yang aktif terdeteksi dengan nama `tcu-wiki` (PID 0).
*   **Backend**: Node.js Express (`tcu-backend`) berjalan di Docker (Port `3000`) dengan ORM Prisma 5.x.
*   **Database**: PostgreSQL 15 berjalan di Docker (Port `5432`).
*   **Proxy**: NGINX reverse proxy dikonfigurasi untuk port `80` dan `443`.

---

## 2. Kustomisasi Agen yang Telah Dikonfigurasi
Kami telah membuat boilerplate konfigurasi untuk agen di folder `.agents/` dan root workspace Anda. Kustomisasi ini siap digunakan untuk mengarahkan perilaku saya:
*   **Aturan Proyek (`always_on`)**: [GEMINI.md](file:///home/tcu/GEMINI.md) berisi aturan penting (seperti pembatasan brand legacy, aturan mail server Postfix/Dovecot, dan koneksi Mikrotik via VPN).
*   **Skrip Kustom (Skills)**: [SKILL.md](file:///home/tcu/.agents/skills/example_skill/SKILL.md) untuk mendefinisikan langkah kerja otomatis.
*   **Plugin Penggabung**: [plugin.json](file:///home/tcu/.agents/plugins/example_plugin/plugin.json) untuk membundel keahlian dan aturan.
*   **Lifecycle Hooks**: [hooks.json](file:///home/tcu/.agents/hooks.json) untuk memicu perintah terminal secara otomatis saat pemanggilan tool.
*   **MCP Servers**: [mcp_config.json](file:///home/tcu/.agents/mcp_config.json) untuk mengintegrasikan perkakas (tools) kustom tambahan.

---

## 3. Status Pekerjaan Terkini (Milestones)
Menurut riwayat `PROJECT.md`, semua tahapan integrasi migrasi (M1 hingga M7) dari sistem lama ke platform baru (TCU Platform) telah ditandai sebagai **DONE (Selesai)**. Ini mencakup:
*   [x] Eksplorasi codebase & perbaikan bug pada todo-app.
*   [x] Pembangunan ulang halaman frontend Next.js.
*   [x] Implementasi backend API & integrasi autentikasi klien.
*   [x] Pengujian End-to-End (E2E) dan Audit Verifikasi.

---

## 4. Cara Melanjutkan Kerja dengan Sesi Baru (Context Reset)
Untuk menjaga kecepatan respon AI tetap cepat dan menghindari kesalahan konteks akibat chat yang terlalu panjang, ikuti panduan kontrol ini:

1.  **Keluar dari Chat Ini**: Ketik `/exit` atau tekan `Ctrl+D` di terminal Anda.
2.  **Mulai Sesi Baru**: Jalankan perintah `agy` (tanpa bendera `-c` atau `--continue`) untuk membuka lembaran baru yang bersih.
3.  **Beri Perintah Awal**: Di chat baru, beritahu saya:
    > *"Baca file todo_list.md untuk memahami status proyek saat ini, lalu bantu saya untuk [tuliskan tugas baru Anda di sini]."*
4.  **Kontrol Eksekusi**: Anda bisa menggunakan:
    *   `/plan` sebelum pengerjaan kode agar saya membuat rencana implementasi terlebih dahulu untuk Anda tinjau.
    *   `/goal` jika Anda ingin saya menyelesaikan tugas besar secara otomatis (misal: pengujian unit baru).
