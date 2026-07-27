'use client';
import { useState, useEffect, useCallback } from 'react';

const STATUS_COLORS = {
  GUDANG:    { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: 'Gudang' },
  DIPINJAM:  { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Dipinjam' },
  TERPASANG: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'Terpasang' },
  RUSAK:     { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', label: 'Rusak / RMA' },
};

const CATEGORIES = ['ONT', 'ROUTER', 'KABEL', 'SPLITTER', 'TOOLS', 'LAINNYA'];

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, gudang: 0, dipinjam: 0, terpasang: 0, rusak: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ serial_number: '', name: '', category: 'ONT', status: 'GUDANG', location_pic: '', notes: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('tcu_token') : '';

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterCategory) params.set('category', filterCategory);
      const res = await fetch(`/api/admin/inventory?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {}
    setLoading(false);
  }, [search, filterStatus, filterCategory, token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/inventory/stats', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  }, [token]);

  useEffect(() => { fetchItems(); fetchStats(); }, [fetchItems, fetchStats]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ serial_number: '', name: '', category: 'ONT', status: 'GUDANG', location_pic: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ serial_number: item.serial_number, name: item.name, category: item.category, status: item.status, location_pic: item.location_pic || '', notes: item.notes || '' });
    setShowModal(true);
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      const url = editItem ? `/api/admin/inventory/${editItem.id}` : '/api/admin/inventory';
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchItems(); fetchStats(); }
      else alert(data.message);
    } catch {}
    setSaving(false);
  };

  const deleteItem = async (id) => {
    if (!confirm('Hapus data barang ini?')) return;
    await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchItems(); fetchStats();
  };

  const STAT_CARDS = [
    { label: 'Total Perangkat', value: stats.total, icon: '📦', color: '#3b82f6' },
    { label: 'Stok di Gudang', value: stats.gudang, icon: '🏢', color: '#10b981' },
    { label: 'Dipinjam / OTW', value: stats.dipinjam, icon: '🚚', color: '#f59e0b' },
    { label: 'Rusak / RMA', value: stats.rusak, icon: '⚠️', color: '#ef4444' },
  ];

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Inventory FTTH & Perangkat</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>Pantau ketersediaan stok modem, router, kabel, dan distribusi alat teknisi.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer' }}>
            ⬇️ Ekspor Data
          </button>
          <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
            <span>➕</span> Barang Masuk (Inbound)
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', cursor: 'pointer' }}
            onClick={() => setFilterStatus(s.label === 'Total Perangkat' ? '' : s.label.split(' / ')[0].toUpperCase().replace(' ', '').replace('TOTALPGUDANG','GUDANG'))}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          className="form-input" placeholder="🔍 Cari serial number, nama, atau lokasi..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '240px' }}
        />
        <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: '160px' }}>
          <option value="">Semua Status</option>
          {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="form-input" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ minWidth: '160px' }}>
          <option value="">Semua Kategori</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              {['Serial Number', 'Nama / Model', 'Kategori', 'Status', 'Lokasi / PIC', 'Masuk', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Memuat data inventory...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                Belum ada data barang. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Tambah sekarang →</button>
              </td></tr>
            ) : items.map((item) => {
              const sc = STATUS_COLORS[item.status] || STATUS_COLORS.GUDANG;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>{item.serial_number}</td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{item.location_pic || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '0.8rem', color: '#64748b' }}>{new Date(item.inbound_date).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(item)} style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem(item.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9' }}>
              {editItem ? 'Edit Data Barang' : 'Tambah Barang Baru (Inbound)'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Serial Number *', key: 'serial_number', full: true },
                { label: 'Nama / Model *', key: 'name', full: true },
                { label: 'Lokasi / PIC', key: 'location_pic', placeholder: 'Gudang, Andi (Teknisi), dll' },
                { label: 'Catatan', key: 'notes', full: true },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.full ? '1 / -1' : undefined }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>{f.label}</label>
                  {f.key === 'notes' ? (
                    <textarea className="form-input" rows={3} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', resize: 'vertical' }} />
                  ) : (
                    <input type="text" className="form-input" placeholder={f.placeholder || ''} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%' }} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Kategori</label>
                <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ width: '100%' }}>
                  {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Batal</button>
              <button onClick={saveItem} disabled={saving} className="btn-primary" style={{ padding: '10px 32px' }}>
                {saving ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Tambah Barang')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
