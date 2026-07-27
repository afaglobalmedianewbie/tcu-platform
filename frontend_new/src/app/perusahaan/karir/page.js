export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Karir | TCU Platform',
  description: 'Bergabunglah dengan tim TCU Platform dan jadilah bagian dari revolusi digital.',
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

export default async function KarirPage() {
  const cms = await getCms();

  if (cms.perusahaan_karir_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.perusahaan_karir_content }} />
      </div>
    );
  }

  const jobs = [
    { title: 'Fullstack Developer (Next.js & Node.js)', type: 'Full-time', location: 'Jakarta / Remote', dept: 'Engineering' },
    { title: 'Network Engineer (MikroTik / Cisco)', type: 'Full-time', location: 'Bandung', dept: 'Network Ops' },
    { title: 'Teknisi Fiber Optic (FTTH)', type: 'Contract', location: 'Cimahi & Sekitarnya', dept: 'Field Ops' },
    { title: 'Sales Executive (B2B)', type: 'Full-time', location: 'Jakarta', dept: 'Sales & Marketing' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Header */}
      <section style={{ padding: '100px 40px 60px', textAlign: 'center' }}>
        <div className='fade-in-up' style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className='badge badge-info' style={{ marginBottom: '24px' }}>We Are Hiring!</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>Bangun Masa Depan Digital Bersama <span style={{ color: 'var(--primary)' }}>Kami</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Kami selalu mencari talenta cerdas, inovatif, dan bersemangat untuk mendorong batasan teknologi telekomunikasi.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>Mengapa TCU Platform?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '80px' }}>
            <div className='stat-card' style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Pertumbuhan Cepat</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Peluang karir yang luas di perusahaan yang sedang berkembang pesat.</p>
            </div>
            <div className='stat-card' style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💻</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Teknologi Modern</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bekerja dengan stack terbaru, dari Next.js hingga arsitektur IoT.</p>
            </div>
            <div className='stat-card' style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>❤️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Keseimbangan Kerja</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Lingkungan kerja yang fleksibel, mendukung work-life balance.</p>
            </div>
          </div>

          {/* Job Listings */}
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px' }}>Posisi Terbuka</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map((job, i) => (
              <div key={i} className='glass-panel' style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#f1f5f9' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>💼 {job.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🏢 {job.dept}</span>
                  </div>
                </div>
                <button className='btn-primary' style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Lamar</button>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
            Tidak menemukan posisi yang cocok? Kirimkan CV Anda ke <a href='mailto:hrd@topclassuniversal.co.id' style={{ color: 'var(--primary)', fontWeight: 600 }}>hrd@topclassuniversal.co.id</a>
          </div>
        </div>
      </section>
    </div>
  );
}
