'use client';
import { useState, useEffect, useCallback } from 'react';

const STATUS_COLORS = {
  NEW:               { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6',  label: 'Baru' },
  CONTACTED:         { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6',  label: 'Dihubungi' },
  SURVEY_SCHEDULED:  { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b',  label: 'Survey Jadwal' },
  SURVEYED:          { bg: 'rgba(16,185,129,0.15)', color: '#10b981',  label: 'Sudah Survey' },
  CONVERTED:         { bg: 'rgba(16,185,129,0.2)',  color: '#10b981',  label: '✓ Konversi' },
  LOST:              { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444',  label: 'Tidak Jadi' },
};

const STATUSES = Object.keys(STATUS_COLORS);

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, survey: 0, converted: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', kelurahan: '', kecamatan: '', kota: '', notes: '', source: '', assigned_to: '', status: 'NEW' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('tcu_token') : '';

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/leads?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch {}
    setLoading(false);
  }, [search, filterStatus, token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads/stats', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  }, [token]);

  useEffect(() => { fetchLeads(); fetchStats(); }, [fetchLeads, fetchStats]);

  const openAdd = () => {
    setEditLead(null);
    setForm({ full_name: '', phone: '', address: '', kelurahan: '', kecamatan: '', kota: '', notes: '', source: '', assigned_to: '', status: 'NEW' });
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setEditLead(lead);
    setForm({ full_name: lead.full_name, phone: lead.phone, address: lead.address, kelurahan: lead.kelurahan || '', kecamatan: lead.kecamatan || '', kota: lead.kota || '', notes: lead.notes || '', source: lead.source || '', assigned_to: lead.assigned_to || '', status: lead.status });
    setShowModal(true);
  };

  const saveLead = async () => {
    setSaving(true);
    try {
      const url = editLead ? `/api/admin/leads/${editLead.id}` : '/api/admin/leads';
      const method = editLead ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchLeads(); fetchStats(); }
      else alert(data.message);
    } catch {}
    setSaving(false);
  };

  const deleteLead = async (id) => {
    if (!confirm('Hapus lead ini?')) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchLeads(); fetchStats();
  };

  const updateStatus = async (lead, status) => {
    await fetch(`/api/admin/leads/${lead.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    fetchLeads(); fetchStats();
  };

  const STAT_CARDS = [
    { label: 'Total Leads', value: stats.total, icon: '📊', color: '#3b82f6' },
    { label: 'Baru Masuk', value: stats.new, icon: '🆕', color: '#8b5cf6' },
    { label: 'Sudah Survey', value: stats.survey, icon: '📋', color: '#f59e0b' },
    { label: 'Konversi', value: stats.converted, icon: '✅', color: '#10b981' },
  ];

  return (
    <div className="fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Manajemen Leads & Survey</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>Pantau dan kelola prospek pelanggan baru.</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
          <span>➕</span> Tambah Lead
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
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
          className="form-input" placeholder="🔍 Cari nama, HP, atau alamat..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '240px' }}
        />
        <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: '180px' }}>
          <option value="">Semua Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              {['Nama / HP', 'Alamat', 'Sumber', 'PIC', 'Status', 'Tgl Masuk', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Memuat data...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                Belum ada lead. <button onClick={openAdd} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Tambah sekarang →</button>
              </td></tr>
            ) : leads.map((l) => {
              const sc = STATUS_COLORS[l.status] || STATUS_COLORS.NEW;
              return (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>{l.full_name}</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'monospace' }}>{l.phone}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8', maxWidth: '200px' }}>
                    <div>{l.address}</div>
                    {l.kecamatan && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l.kecamatan}, {l.kota}</div>}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{l.source || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>{l.assigned_to || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={l.status}
                      onChange={e => updateStatus(l, e.target.value)}
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40`, borderRadius: '6px', padding: '4px 8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.8rem', color: '#64748b' }}>{new Date(l.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(l)} style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteLead(l.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9' }}>
              {editLead ? 'Edit Lead' : 'Tambah Lead Baru'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Nama Lengkap *', key: 'full_name', full: true },
                { label: 'Nomor HP *', key: 'phone' },
                { label: 'Sumber Lead', key: 'source', placeholder: 'WhatsApp, Referral, dll' },
                { label: 'Alamat Lengkap *', key: 'address', full: true },
                { label: 'Kelurahan', key: 'kelurahan' },
                { label: 'Kecamatan', key: 'kecamatan' },
                { label: 'Kota', key: 'kota' },
                { label: 'PIC (CS/Sales)', key: 'assigned_to' },
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
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ width: '100%' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Batal</button>
              <button onClick={saveLead} disabled={saving} className="btn-primary" style={{ padding: '10px 32px' }}>
                {saving ? 'Menyimpan...' : (editLead ? 'Simpan Perubahan' : 'Tambah Lead')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
