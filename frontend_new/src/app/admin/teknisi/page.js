'use client';

const woList = [
  { id: 'WO-112', teknisi: 'Joko S.', jenis: 'Pasang Baru', area: 'Kecamatan Barat', status: 'Selesai', waktu: 'Hari ini, 09:15' },
  { id: 'WO-113', teknisi: 'Rudi H.', jenis: 'Perbaikan LOS', area: 'Kecamatan Timur', status: 'Sedang Dikerjakan', waktu: 'Hari ini, 10:30' },
  { id: 'WO-114', teknisi: 'Belum Di-assign', jenis: 'Penarikan Kabel', area: 'Kecamatan Utara', status: 'Menunggu', waktu: '-' },
];

export default function TeknisiPage() {
  return (
    <div className='fade-in-up'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Operasional Teknisi</h1>
        <button className='btn-primary'>+ Buat Work Order (WO)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className='stat-card'>
          <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total WO Hari Ini</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>24</div>
        </div>
        <div className='stat-card' style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>WO Selesai</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>18</div>
        </div>
        <div className='stat-card' style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Sedang Dikerjakan</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>4</div>
        </div>
        <div className='stat-card' style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Menunggu (Pending)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>2</div>
        </div>
      </div>

      <div className='glass-panel' style={{ overflow: 'hidden' }}>
        <table className='data-table'>
          <thead>
            <tr>
              <th>ID WO</th>
              <th>Jenis Pekerjaan</th>
              <th>Area / Lokasi</th>
              <th>Teknisi Ditugaskan</th>
              <th>Status</th>
              <th>Waktu (Update Terakhir)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {woList.map(wo => (
              <tr key={wo.id}>
                <td style={{ fontWeight: 600 }}>{wo.id}</td>
                <td>{wo.jenis}</td>
                <td>{wo.area}</td>
                <td>{wo.teknisi}</td>
                <td>
                  <span className={`badge ${wo.status === 'Selesai' ? 'badge-success' : wo.status === 'Sedang Dikerjakan' ? 'badge-warning' : 'badge-danger'}`}>
                    {wo.status}
                  </span>
                </td>
                <td>{wo.waktu}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className='btn-secondary' style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Detail</button>
                    {wo.status === 'Menunggu' && <button className='btn-primary' style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Assign</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
