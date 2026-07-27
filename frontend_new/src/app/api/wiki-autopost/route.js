import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer TCUSecretKey123') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // ignore
  }

  const featureName = body.featureName || 'Pembaruan Fitur Platform';
  const description = body.description || 'Penyempurnaan modul antarmuka dan infrastruktur jaringan Top Class Universal.';

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const now = new Date();
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const slug = 'wiki-update-' + Date.now();
  const wikiEntry = {
    title: `Catatan Pembaruan: ${featureName}`,
    category: body.category || 'Release Notes',
    slug,
    date: dateStr,
    author: 'AI Documentation Manager',
    excerpt: `Dokumentasi resmi pembaruan fitur platform TCU: ${featureName}.`,
    content: `<p><strong>Deskripsi Pembaruan:</strong></p><p>${description}</p><h3 style="font-size: 1.4rem; font-weight: 700; color: #3b82f6; margin-top: 16px;">Detail Implementasi</h3><ul style="list-style-type: disc; padding-left: 20px;"><li>Tanggal Penerapan: <code>${dateStr}</code></li><li>Status Rilis: <span style="color: #10b981; font-weight: 700;">AKTIF DIDEPLOY</span></li><li>Modul Terkait: <code>${featureName}</code></li></ul>`
  };

  const filePath = path.join(process.cwd(), 'src/data/wiki.json');
  let docs = [];
  try {
    if (fs.existsSync(filePath)) {
      docs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    docs = [];
  }

  docs.unshift(wikiEntry);
  fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));

  return new Response(JSON.stringify({ success: true, doc: wikiEntry }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
