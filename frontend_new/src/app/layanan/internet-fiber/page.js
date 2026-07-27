export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3000';

async function getPlans() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/plans`, { cache: 'no-store' });
    const json = await res.json();
    return json.success ? json.plans : [];
  } catch (err) {
    console.error('Failed to fetch plans:', err);
    return [];
  }
}

export default async function PaketPage() {
  const plans = await getPlans();
  const paketRumah = plans.filter(p => p.speed_mbps < 100);
  const paketBisnis = plans.filter(p => p.speed_mbps >= 100);

  const formatPrice = (price) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ flex: 1, padding: '80px 40px' }}>
        <div className="container fade-in-up">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-info" style={{ marginBottom: '16px' }}>Pilihan Layanan Terbaik</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Paket Internet Fiber TCU
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Pilih paket internet terbaik untuk menunjang aktivitas digital harian Anda di rumah maupun operasional bisnis Anda.
            </p>
          </div>

          {/* Paket Rumah Section */}
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '32px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              🏠 Paket Rumah
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
              {paketRumah.length > 0 ? (
                paketRumah.map((p) => (
                  <div key={p.id} className="glass-panel" style={{ padding: '40px', border: p.popular ? '1px solid var(--primary)' : '1px solid var(--glass-border)', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {p.popular && <span className="badge badge-info" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>🔥 Paling Populer</span>}
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: p.popular ? 'var(--primary)' : 'var(--text-main)', marginBottom: '4px', letterSpacing: '-0.02em' }}>{p.speed_mbps} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>{formatPrice(p.price)}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/bulan</span></div>
                    <ul style={{ listStyle: 'none', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, padding: 0 }}>
                      {p.features.map((f, i) => <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ {f}</li>)}
                    </ul>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <a href={`/register?paket=${p.id}`} className="btn-primary" style={{ textAlign: 'center', display: 'block', width: '100%' }}>Pilih Paket</a>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada paket rumah.</p>
              )}
            </div>
          </div>

          {/* Paket Bisnis Section */}
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '32px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              💼 Paket Bisnis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
              {paketBisnis.length > 0 ? (
                paketBisnis.map((p) => (
                  <div key={p.id} className="glass-panel" style={{ padding: '40px', border: p.popular ? '1px solid var(--primary)' : '1px solid var(--glass-border)', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {p.popular && <span className="badge badge-info" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>🔥 Paling Populer</span>}
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: p.popular ? 'var(--primary)' : 'var(--text-main)', marginBottom: '4px', letterSpacing: '-0.02em' }}>{p.speed_mbps} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>{formatPrice(p.price)}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/bulan</span></div>
                    <ul style={{ listStyle: 'none', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, padding: 0 }}>
                      {p.features.map((f, i) => <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ {f}</li>)}
                    </ul>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <a href={`/register?paket=${p.id}`} className="btn-primary" style={{ textAlign: 'center', display: 'block', width: '100%' }}>Pilih Paket</a>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada paket bisnis.</p>
              )}
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
