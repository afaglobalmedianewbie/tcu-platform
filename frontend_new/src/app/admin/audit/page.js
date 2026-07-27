'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('tcu_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/admin/audit', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setLogs(data.logs);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handleDownloadCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Waktu', 'Pengguna', 'Aktivitas', 'Metode', 'Endpoint', 'Alamat IP', 'User Agent'];
    const rows = filteredLogs.map(l => [
      new Date(l.created_at).toLocaleString('id-ID'),
      l.user.email || l.user.full_name,
      l.action,
      l.method,
      l.endpoint,
      l.ip_address,
      l.user_agent
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    const userStr = (l.user.email || l.user.full_name || '').toLowerCase();
    const actionStr = (l.action || '').toLowerCase();
    const ipStr = (l.ip_address || '').toLowerCase();
    const matchSearch = userStr.includes(search.toLowerCase()) || 
                        actionStr.includes(search.toLowerCase()) || 
                        ipStr.includes(search.toLowerCase());

    if (filterType === 'ALL') return matchSearch;
    if (filterType === 'DANGER') {
      return matchSearch && (l.method === 'DELETE' || actionStr.includes('fail') || actionStr.includes('gagal') || actionStr.includes('error'));
    }
    if (filterType === 'MUTATION') {
      return matchSearch && (l.method === 'POST' || l.method === 'PUT' || l.method === 'DELETE');
    }
    return matchSearch;
  });

  return (
    <div className='fade-in-up'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>Audit Log & Keamanan</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Daftar dinamis seluruh aktivitas penulisan database dan aksi sistem.</p>
        </div>
        <button onClick={handleDownloadCSV} className='btn-secondary' style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem' }}>Unduh Laporan CSV</button>
      </div>

      <div className='glass-panel' style={{ padding: '24px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='form-input' 
            placeholder='Cari aktivitas, email, atau IP...' 
            style={{ flex: 1, padding: '10px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }} 
          />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className='form-input' 
            style={{ width: '200px', padding: '10px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
          >
            <option value="ALL">Semua Aktivitas</option>
            <option value="MUTATION">Perubahan Data (POST/PUT/DELETE)</option>
            <option value="DANGER">Peringatan / Bahaya</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Memuat logs...</div>
        ) : (
          <table className='data-table'>
            <thead>
              <tr style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Waktu</th>
                <th style={{ padding: '12px 16px' }}>Pengguna / Sistem</th>
                <th style={{ padding: '12px 16px' }}>Aktivitas</th>
                <th style={{ padding: '12px 16px' }}>Alamat IP</th>
                <th style={{ padding: '12px 16px' }}>Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? filteredLogs.map((l, idx) => {
                const isDanger = l.method === 'DELETE' || l.action.toLowerCase().includes('fail') || l.action.toLowerCase().includes('gagal') || l.action.toLowerCase().includes('error');
                return (
                  <tr key={l.id || idx} style={{ background: isDanger ? 'rgba(239,68,68,0.03)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.83rem' }}>{new Date(l.created_at).toLocaleString('id-ID')}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#e2e8f0', fontSize: '0.83rem' }}>{l.user?.email || l.user?.full_name || 'System/Cron'}</td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '0.83rem' }}>{l.action}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.83rem' }}>{l.ip_address}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {isDanger ? (
                        <span className='badge badge-danger' style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Peringatan</span>
                      ) : (
                        <span className='badge badge-info' style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>Info</span>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Tidak ada log ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
