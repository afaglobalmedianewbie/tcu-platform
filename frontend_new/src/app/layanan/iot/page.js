export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'IoT Solutions | TCU Platform',
  description: 'Solusi Internet of Things pintar dari TCU Platform untuk otomatisasi dan efisiensi.',
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

export default async function IoTSolutionPage() {
  const cms = await getCms();

  if (cms.layanan_iot_content) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc', padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: cms.layanan_iot_content }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Hero */}
      <section style={{ padding: '120px 40px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className='fade-in-up' style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <span className='badge badge-success' style={{ marginBottom: '24px' }}>Smart Connected Future</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
            Hubungkan Segalanya dengan <span style={{ color: '#10b981' }}>IoT Solutions</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Kendali penuh di genggaman Anda. Kami menghadirkan teknologi cerdas untuk industri, smart home, dan smart city yang terintegrasi secara seamless.
          </p>
        </div>
      </section>

      {/* IoT Categories */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className='glass-panel' style={{ display: 'flex', gap: '32px', padding: '40px', alignItems: 'center', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '5rem', flexShrink: 0 }}>🏭</div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Industrial IoT (IIoT)</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Otomatisasi pabrik, pemantauan mesin real-time, predictive maintenance, dan optimalisasi rantai pasok untuk meningkatkan efisiensi operasional.</p>
            </div>
          </div>

          <div className='glass-panel' style={{ display: 'flex', gap: '32px', padding: '40px', alignItems: 'center', borderLeft: '4px solid #3b82f6', flexDirection: 'row-reverse' }}>
            <div style={{ fontSize: '5rem', flexShrink: 0 }}>🏙️</div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Smart City Solutions</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Sistem manajemen lalu lintas pintar, pencahayaan jalan terhubung, dan pengelolaan utilitas publik untuk kota yang lebih hijau dan aman.</p>
            </div>
          </div>

          <div className='glass-panel' style={{ display: 'flex', gap: '32px', padding: '40px', alignItems: 'center', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '5rem', flexShrink: 0 }}>🏠</div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Smart Home Automation</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Ubah rumah Anda menjadi ekosistem cerdas. Kontrol suhu, keamanan, dan peralatan elektronik hanya melalui aplikasi di smartphone Anda.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Architecture */}
      <section style={{ padding: '80px 40px', background: 'rgba(15,23,42,0.5)', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px' }}>Bagaimana Sistem Kami Bekerja</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'center' }}>
            <div className='stat-card'>📡<br/><strong style={{display:'block',marginTop:'8px'}}>1. Sensor & Device</strong><small style={{color:'var(--text-muted)'}}>Pengumpulan Data</small></div>
            <div style={{ color: '#10b981', fontSize: '2rem' }}>→</div>
            <div className='stat-card'>☁️<br/><strong style={{display:'block',marginTop:'8px'}}>2. Cloud Platform</strong><small style={{color:'var(--text-muted)'}}>Pemrosesan Aman</small></div>
            <div style={{ color: '#10b981', fontSize: '2rem' }}>→</div>
            <div className='stat-card'>📱<br/><strong style={{display:'block',marginTop:'8px'}}>3. Dashboard</strong><small style={{color:'var(--text-muted)'}}>Aksi & Monitoring</small></div>
          </div>
        </div>
      </section>
    </div>
  );
}
