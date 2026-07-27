const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { google } = require('googleapis');
require('dotenv').config();

// Konfigurasi Google Drive
const FOLDER_ID = '1PqI4GgqdTOBIRK-Q8IW1E2dT5E8i1UNk';
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

async function backupDatabase() {
  console.log('⏳ [BACKUP] Memulai proses backup database PostgreSQL...');
  
  // Periksa apakah credentials.json ada
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ [BACKUP] File credentials.json tidak ditemukan. Harap masukkan file Service Account GCP ke direktori backend.');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `tcu_backup_${timestamp}.sql`;
  const backupFilePath = path.join(__dirname, backupFileName);

  // Ambil URL DB dari environment atau gunakan default Docker network URL (karena berjalan di container backend yang sama)
  const dbUrl = process.env.DATABASE_URL || 'postgresql://tcu_admin:tcu_secure_password123@tcu-db:5432/tcu_db';

  // 1. Eksekusi pg_dump
  const dumpCommand = `pg_dump "${dbUrl}" -F c -f "${backupFilePath}"`;
  
  exec(dumpCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error('❌ [BACKUP] Gagal melakukan pg_dump:', error.message);
      return;
    }
    
    console.log(`✅ [BACKUP] Database berhasil di-dump: ${backupFileName}`);
    console.log('⏳ [BACKUP] Mengunggah ke Google Drive...');

    try {
      // 2. Auth dengan Service Account Google
      const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const drive = google.drive({ version: 'v3', auth });

      const fileMetadata = {
        name: backupFileName,
        parents: [FOLDER_ID],
      };

      const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(backupFilePath),
      };

      // 3. Upload ke Google Drive
      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name',
      });

      console.log(`✅ [BACKUP] Berhasil diunggah ke Google Drive dengan ID: ${file.data.id}`);

      // 4. Hapus file backup lokal agar tidak memenuhi storage
      fs.unlinkSync(backupFilePath);
      console.log('🧹 [BACKUP] File backup lokal dihapus.');

    } catch (err) {
      console.error('❌ [BACKUP] Gagal mengunggah ke Google Drive:', err.message);
    }
  });
}

// Jika dijalankan manual dari CLI: node backup_gdrive.js
if (require.main === module) {
  backupDatabase();
}

module.exports = backupDatabase;
