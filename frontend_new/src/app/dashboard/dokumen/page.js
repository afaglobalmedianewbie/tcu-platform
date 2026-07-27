'use client';

const documents = [
  { id: 'DOC-001', nama: 'Kontrak Berlangganan', tanggal: '2026-01-15', tipe: 'PDF', ukuran: '2.4 MB' },
  { id: 'DOC-002', nama: 'Formulir Pendaftaran', tanggal: '2026-01-15', tipe: 'PDF', ukuran: '1.1 MB' },
  { id: 'DOC-003', nama: 'KTP Pelanggan', tanggal: '2026-01-14', tipe: 'IMG', ukuran: '3.5 MB' },
];

export default function DokumenPage() {
  return (
    <div className='fade-in-up'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Dokumen Digital</h1>
        <button className='btn-primary'>+ Unggah Dokumen</button>
      </div>

      <div className='glass-panel' style={{ overflow: 'hidden' }}>
        <table className='data-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Dokumen</th>
              <th>Tipe</th>
              <th>Ukuran</th>
              <th>Tanggal Unggah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td style={{ fontWeight: 600 }}>{doc.id}</td>
                <td>{doc.nama}</td>
                <td><span className='badge badge-info'>{doc.tipe}</span></td>
                <td>{doc.ukuran}</td>
                <td>{doc.tanggal}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className='btn-secondary' style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Lihat</button>
                    <button className='btn-secondary' style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Unduh</button>
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
