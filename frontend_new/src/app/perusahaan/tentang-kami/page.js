export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tentang Kami | TCU Platform',
  description: 'Sejarah dan visi misi PT Top Class Universal (TCU Platform).',
};

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3000';

async function getCms() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/cms`, { cache: 'no-store' });
    const json = await res.json();
    return json.success ? json.data : {};
  } catch (err) {
    console.error('Failed to fetch CMS:', err);
    return {};
  }
}

export default async function TentangKamiPage() {
  const cms = await getCms();

  if (cms.perusahaan_tentang_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.perusahaan_tentang_content }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Header */}
      <section style={{ padding: '100px 40px 60px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(37,99,235,0.05) 100%)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className='fade-in-up' style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>Mengenal <span style={{ color: 'var(--primary)' }}>TCU Platform</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            PT Top Class Universal lahir dari dedikasi untuk menghubungkan Indonesia melalui teknologi komunikasi terbaik dan solusi digital inovatif.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
          
          {/* Visi Misi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div className='glass-panel' style={{ padding: '40px', borderTop: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>👁️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Visi Kami</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Menjadi penyedia layanan teknologi dan telekomunikasi terdepan yang mendorong pertumbuhan digital di seluruh lapisan masyarakat dan industri.
              </p>
            </div>
            <div className='glass-panel' style={{ padding: '40px', borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Misi Kami</h3>
              <ul style={{ color: 'var(--text-muted)', lineHeight: 1.7, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Menghadirkan konektivitas yang stabil dan terjangkau.</li>
                <li>Memberikan inovasi layanan digital dan IoT termutakhir.</li>
                <li>Memastikan pelayanan pelanggan berkelas (Top Class).</li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>Perjalanan Kami</h2>
            <div className='glass-panel' style={{ padding: '40px' }}>
              <div className='timeline'>
                {[
                  { year: '2019', title: 'Awal Mula', desc: 'Didirikan dengan fokus awal membangun infrastruktur fiber optik lokal.' },
                  { year: '2021', title: 'Ekspansi Layanan', desc: 'Merambah to solusi manajemen ISP terintegrasi dan layanan cloud.' },
                  { year: '2023', title: 'Re-branding & Transformasi', desc: 'Bertransformasi menjadi TCU Platform (PT Top Class Universal) untuk layanan skala Enterprise.' },
                  { year: '2026', title: 'Masa Depan', desc: 'Integrasi penuh AI, IoT, dan ekosistem digital untuk Smart City.' }
                ].map((item, i) => (
                  <div key={i} className='timeline-item'>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{item.year}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', color: '#f1f5f9' }}>{item.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
