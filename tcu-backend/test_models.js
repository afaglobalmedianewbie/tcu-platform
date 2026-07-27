const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Muat konfigurasi .env.staging secara manual tanpa rely pada dotenv dependency
const envPath = path.join(__dirname, '.env.staging');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  console.log("Menghubungkan ke Staging Database:", process.env.DATABASE_URL);
  
  const models = [
    'user',
    'role',
    'permission',
    'userRole',
    'rolePermission',
    'fileAsset',
    'fileVersion',
    'cmsPost',
    'autoPostJob',
    'kbArticle',
    'kbVersion',
    'auditLog'
  ];

  let healthy = true;
  for (const model of models) {
    try {
      const count = await prisma[model].count();
      console.log(`[HEALTH_OK] Model '${model}' berhasil diakses. Baris: ${count}`);
    } catch (e) {
      console.error(`[HEALTH_ERR] Model '${model}' GAGAL diakses:`, e.message);
      healthy = false;
    }
  }

  await prisma.$disconnect();

  if (healthy) {
    console.log("\n>>> STATUS: SELURUH TABEL MODULAR SEHAT & DAPAT DIAKSES DI DATABASE STAGING! <<<");
    process.exit(0);
  } else {
    console.error("\n>>> STATUS: BEBERAPA TABEL DI DATABASE STAGING BERMASALAH/BELUM DIMIGRASI! <<<");
    process.exit(1);
  }
}

main();
