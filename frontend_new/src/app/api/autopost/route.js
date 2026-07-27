import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer TCUSecretKey123') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const API_KEY = process.env.GEMINI_API_KEY || '';
  const prompt = `Write a premium, technical yet accessible blog post for an ISP company named Top Class Universal. 
  The topic should be about fiber optics, networking, IoT, digital solutions, or internet technology in general.
  The output MUST be a single, valid JSON object with keys: title, subtitle, slug, excerpt, content.`;

  let postData = null;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        let jsonText = data.candidates[0].content.parts[0].text;
        jsonText = jsonText.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
        postData = JSON.parse(jsonText);
      }
    }
  } catch (e) {
    console.error('Gemini API generate failed, using fallback generator:', e);
  }

  // Fallback if API key is invalid or quota limited
  if (!postData || !postData.title) {
    const topics = [
      { title: 'Inovasi Fiber Optic Tercepat di Jawa Barat', slug: 'inovasi-fiber-optic-jawa-barat-' + Date.now(), category: 'Teknologi' },
      { title: 'Solusi Smart Home & IoT untuk Rumah Modern', slug: 'solusi-smart-home-iot-' + Date.now(), category: 'IoT' },
      { title: 'Keunggulan Bandwidth Dedicated untuk Bisnis', slug: 'keunggulan-bandwidth-dedicated-' + Date.now(), category: 'Bisnis' },
      { title: 'Optimasi Jaringan FTTH dan Keamanan Cyber', slug: 'optimasi-jaringan-ftth-' + Date.now(), category: 'Jaringan' }
    ];
    const picked = topics[Math.floor(Math.random() * topics.length)];
    postData = {
      title: picked.title,
      subtitle: 'Inovasi konektivitas berkecepatan tinggi tanpa hambatan dari Top Class Universal.',
      slug: picked.slug,
      category: picked.category,
      excerpt: 'Top Class Universal terus meluncurkan pembaruan infrastruktur jaringan fiber optik mutakhir untuk mendukung kebutuhan digital masyarakat.',
      content: `<p>Top Class Universal berkomitmen menyediakan layanan internet fiber optik paling stabil dengan jaminan SLA 99.9%. Melalui penerapan teknologi FTTH terbaru, setiap pelanggan mendapatkan kehandalan koneksi tinggi.</p><h3 style="font-size: 1.6rem; font-weight: 700; margin-top: 20px; color: #3b82f6;">Keunggulan Infrastruktur TCU</h3><ul style="list-style-type: disc; padding-left: 24px; display: flex; flex-direction: column; gap: 12px;"><li>Koneksi simetris upload dan download</li><li>Router Dual-Band dengan jangkauan lebih luas</li><li>Dukungan NOC 24/7 untuk monitoring latency</li></ul>`
    };
  }

  // Format date in Indonesian
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const now = new Date();
  postData.date = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  postData.author = 'AI Studio TCU';

  // Save to posts.json
  const filePath = path.join(process.cwd(), 'src/data/posts.json');
  let posts = [];
  try {
    if (fs.existsSync(filePath)) {
      posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    posts = [];
  }
  
  posts.unshift(postData);
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

  // Trigger automatic documentation entry in Wiki/Help Center
  try {
    const wikiFilePath = path.join(process.cwd(), 'src/data/wiki.json');
    let wikiDocs = [];
    if (fs.existsSync(wikiFilePath)) {
      wikiDocs = JSON.parse(fs.readFileSync(wikiFilePath, 'utf8'));
    }
    const wikiEntry = {
      title: `Publikasi Artikel AI: ${postData.title}`,
      category: 'Release Notes',
      slug: `autopost-release-${Date.now()}`,
      date: postData.date,
      author: 'Autopost System',
      excerpt: `Rilis konten blog baru otomatis berbasis AI Studio: "${postData.title}".`,
      content: `<p>Sistem Autopost AI telah secara otomatis menerbitkan artikel blog baru dengan judul <strong>${postData.title}</strong> ke dalam portal CMS dan halaman blog publik.</p><p>Kategori: <code>${postData.category || 'Berita'}</code> | URL Slug: <code>/blog/${postData.slug}</code></p>`
    };
    wikiDocs.unshift(wikiEntry);
    fs.writeFileSync(wikiFilePath, JSON.stringify(wikiDocs, null, 2));
  } catch (e) {
    console.error('Failed to auto-update wiki.json:', e);
  }

  return new Response(JSON.stringify({ success: true, post: postData }), { 
    status: 200, 
    headers: { 'Content-Type': 'application/json' } 
  });
}
