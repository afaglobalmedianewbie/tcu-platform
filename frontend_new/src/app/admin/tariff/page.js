'use client';
import { useState, useEffect } from 'react';

export default function TariffPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlan, setCurrentPlan] = useState({ id: '', name: '', speed_mbps: '', price: '', mikrotik_profile: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans);
      } else {
        setError(data.message || 'Gagal memuat paket.');
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, plan = null) => {
    setModalMode(mode);
    if (plan) {
      setCurrentPlan({ ...plan });
    } else {
      setCurrentPlan({ id: '', name: '', speed_mbps: '', price: '', mikrotik_profile: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tcu_token');
    
    const endpoint = modalMode === 'add' ? '/api/admin/plans' : `/api/admin/plans/${currentPlan.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    
    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentPlan)
      });
      
      const data = await res.json();
      if (data.success) {
        fetchPlans();
        handleCloseModal();
      } else {
        alert('Gagal: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;
    const token = localStorage.getItem('tcu_token');
    
    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchPlans();
      } else {
        alert('Gagal: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div className='fade-in-up'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', color: '#f1f5f9' }}>Tariff & Packages</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Kelola daftar paket internet, harga, dan profil Mikrotik.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className='btn-primary' style={{ padding: '10px 24px', borderRadius: '8px' }}>
          + Tambah Paket
        </button>
      </div>

      {error && <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

      <div className='glass-panel' style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Nama Paket</th>
              <th>Speed (Mbps)</th>
              <th>Harga (Rp)</th>
              <th>Profil Mikrotik / OLT</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Memuat data...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Belum ada data paket.</td></tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{plan.name}</td>
                  <td>{plan.speed_mbps} Mbps</td>
                  <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(plan.price)}</td>
                  <td><span className='badge badge-info'>{plan.mikrotik_profile || '-'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenModal('edit', plan)} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(plan.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className='glass-panel' style={{ width: '450px', background: '#1e293b', padding: '32px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#f1f5f9' }}>{modalMode === 'add' ? 'Tambah Paket Baru' : 'Edit Paket'}</h2>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className='form-group'>
                <label className='form-label' style={{ color: '#e2e8f0' }}>Nama Paket</label>
                <input type='text' value={currentPlan.name} onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})} className='form-input' style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }} placeholder='Misal: Pro 50 Mbps' required />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ color: '#e2e8f0' }}>Kecepatan (Mbps)</label>
                <input type='number' value={currentPlan.speed_mbps} onChange={e => setCurrentPlan({...currentPlan, speed_mbps: e.target.value})} className='form-input' style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }} placeholder='50' required />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ color: '#e2e8f0' }}>Harga (Rp)</label>
                <input type='number' value={currentPlan.price} onChange={e => setCurrentPlan({...currentPlan, price: e.target.value})} className='form-input' style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }} placeholder='300000' required />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ color: '#e2e8f0' }}>Profil Mikrotik / OLT</label>
                <input type='text' value={currentPlan.mikrotik_profile} onChange={e => setCurrentPlan({...currentPlan, mikrotik_profile: e.target.value})} className='form-input' style={{ background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }} placeholder='profile-50m' />
                <small style={{ color: '#94a3b8', marginTop: '4px', display: 'block' }}>Penting: Pastikan nama profil ini sama persis dengan yang ada di Mikrotik / Radius.</small>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type='button' onClick={handleCloseModal} style={{ padding: '10px 24px', background: 'transparent', color: '#94a3b8', border: '1px solid #475569', borderRadius: '8px', cursor: 'pointer' }}>Batal</button>
                <button type='submit' className='btn-primary' style={{ padding: '10px 24px', borderRadius: '8px' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
