export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mitra & Partner | TCU Platform',
  description: 'Jaringan mitra teknologi dan bisnis yang mendukung TCU Platform.',
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

export default async function PartnerPage() {
  const cms = await getCms();

  if (cms.perusahaan_partner_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.perusahaan_partner_content }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Header */}
      <section style={{ padding: '120px 40px 60px', textAlign: 'center', position: 'relative' }}>
        <div className='fade-in-up' style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>Jaringan <span style={{ color: 'var(--primary)' }}>Kemitraan</span> Global</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Kami berkolaborasi dengan pemimpin teknologi dunia dan institusi lokal untuk memberikan layanan berkualitas tanpa kompromi.
          </p>
        </div>
      </section>

      {/* Partner Logos / Grid */}
      <section style={{ padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Technology Partners</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              {['MikroTik', 'Cisco', 'ZTE', 'Huawei', 'FreeRADIUS', 'Next.js', 'PostgreSQL'].map((partner) => (
                <div key={partner} className='glass-panel' style={{ width: '180px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', opacity: 0.8, transition: 'all 0.3s' }}>
                  {partner}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment & Integrations</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              {['Xendit (Xenplatform)', 'OVO', 'GoPay', 'BCA Virtual Account', 'Mandiri', 'QRIS'].map((partner) => (
                <div key={partner} className='glass-panel' style={{ width: '220px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', background: 'rgba(255,255,255,0.02)' }}>
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* Become a Partner */}
          <div className='glass-panel' style={{ padding: '48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(15,23,42,0.9) 100%)', border: '1px solid rgba(37,99,235,0.3)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Ingin Menjadi Mitra Kami?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px' }}>
               Dapatkan akses ke ekosistem TCU Platform dan ciptakan nilai tambah bagi pelanggan Anda. Mari tumbuh bersama.
            </p>
            <a href='/kontak' className='btn-primary' style={{ padding: '14px 32px', fontSize: '1.1rem' }}>Hubungi Tim Partnership</a>
          </div>

        </div>
      </section>
    </div>
  );
}
