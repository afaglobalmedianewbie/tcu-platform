'use client';

const notifications = [
  { id: 1, title: 'Tagihan Baru Terbit', desc: 'Tagihan untuk periode Juli 2026 sebesar Rp 388.500 telah terbit.', date: '2026-07-01 08:00', read: false },
  { id: 2, title: 'Tiket Selesai', desc: 'Tiket TKT-0820 tentang pergantian password WiFi telah diselesaikan.', date: '2026-06-25 14:30', read: true },
  { id: 3, title: 'Pembayaran Berhasil', desc: 'Terima kasih, pembayaran untuk tagihan Juni 2026 telah kami terima.', date: '2026-06-10 09:15', read: true },
  { id: 4, title: 'Maintenance Area', desc: 'Akan ada perbaikan jaringan di area Anda pada tanggal 5 Juni pukul 02:00 - 04:00.', date: '2026-06-03 10:00', read: true },
];

export default function NotifikasiPage() {
  return (
    <div className='fade-in-up'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Notifikasi</h1>
        <button className='btn-secondary' style={{ fontSize: '0.8rem' }}>Tandai Semua Dibaca</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map(notif => (
          <div key={notif.id} className='glass-panel' style={{ padding: '20px', borderLeft: notif.read ? 'none' : '4px solid var(--primary)', background: notif.read ? 'var(--glass-bg)' : 'rgba(37,99,235,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: notif.read ? 500 : 700 }}>{notif.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{notif.date}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{notif.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
