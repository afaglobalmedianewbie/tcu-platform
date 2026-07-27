export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profil Perusahaan | TCU Platform',
  description: 'Profil lengkap PT Top Class Universal, legalitas, dan struktur organisasi.',
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

export default async function ProfilPerusahaanPage() {
  const cms = await getCms();

  if (cms.perusahaan_profil_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.perusahaan_profil_content }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Header */}
      <section style={{ padding: '100px 40px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className='fade-in-up' style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>Profil Perusahaan</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Membangun konektivitas dengan integritas dan profesionalisme tingkat tinggi.</p>
        </div>
      </section>

      <section style={{ padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Identitas Perusahaan */}
          <div className='glass-panel' style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Identitas Resmi</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nama Perusahaan</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>PT Top Class Universal</div>
              </li>
              <li>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Brand Utama</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>TCU Platform</div>
              </li>
              <li>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bidang Usaha</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Telekomunikasi, Internet Service Provider (ISP), IT Konsultan, IoT</div>
              </li>
              <li>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Website Resmi</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}><a href='https://topclassuniversal.co.id' style={{ color: 'var(--primary)', textDecoration: 'none' }}>https://topclassuniversal.co.id</a></div>
              </li>
            </ul>
          </div>

          {/* Legalitas & Kontak */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className='glass-panel' style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Kantor Pusat</h2>
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Gedung TCU Tower, Lt. 5<br/>
                Jl. Teknologi No. 88, Pusat Bisnis Digital<br/>
                Jakarta Selatan, 12345, Indonesia
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <a href='/kontak' className='btn-secondary' style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Lihat Peta</a>
              </div>
            </div>

            <div className='glass-panel' style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(16,185,129,0.05) 100%)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Standar & Sertifikasi</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                TCU Platform beroperasi di bawah izin resmi Kementerian Kominfo RI dan mematuhi standar keamanan ISO 27001 untuk menjamin kerahasiaan dan integritas data pelanggan.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
