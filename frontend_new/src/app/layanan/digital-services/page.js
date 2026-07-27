export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Digital Services | TCU Platform',
  description: 'Layanan digital terintegrasi dari TCU Platform untuk mendukung transformasi bisnis Anda.',
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

export default async function DigitalServicesPage() {
  const cms = await getCms();

  if (cms.layanan_digital_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.layanan_digital_content }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Hero Section */}
      <section style={{ padding: '120px 40px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className='fade-in-up' style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <span className='badge badge-info' style={{ marginBottom: '24px' }}>TCU Digital Solutions</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
            Transformasi Bisnis dengan <span style={{ color: 'var(--primary)' }}>Digital Services</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Tingkatkan efisiensi dan skala bisnis Anda dengan solusi digital kami yang dirancang khusus untuk memenuhi tantangan industri modern.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { icon: '☁️', title: 'Cloud Infrastructure', desc: 'Layanan cloud hosting, VPS, dan dedicated server dengan uptime 99.9% dan keamanan tinggi.' },
            { icon: '💻', title: 'Web & App Development', desc: 'Pembuatan aplikasi kustom dan website enterprise yang responsif serta mudah dikelola.' },
            { icon: '🛡️', title: 'Cybersecurity Solutions', desc: 'Perlindungan data dan jaringan dari serangan siber dengan standar keamanan internasional.' },
            { icon: '📊', title: 'Data Analytics', desc: 'Ubah data mentah menjadi wawasan bisnis yang dapat ditindaklanjuti untuk pengambilan keputusan.' },
            { icon: '📱', title: 'Digital Marketing', desc: 'Tingkatkan visibilitas merek Anda melalui strategi pemasaran digital yang tepat sasaran.' },
            { icon: '🤝', title: 'IT Consulting', desc: 'Konsultasi ahli untuk merancang arsitektur IT yang sejalan dengan tujuan jangka panjang bisnis.' }
          ].map((s, i) => (
            <div key={i} className='glass-panel' style={{ padding: '32px', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{s.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px', color: '#f1f5f9' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className='glass-panel' style={{ maxWidth: '900px', margin: '0 auto', padding: '48px', background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(37,99,235,0.3)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Mulai Perjalanan Digital Anda</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>Diskusikan kebutuhan sistem Anda dengan tim ahli TCU Platform.</p>
          <a href='/kontak' className='btn-primary' style={{ padding: '14px 32px', fontSize: '1.1rem' }}>Konsultasi Gratis</a>
        </div>
      </section>
    </div>
  );
}
