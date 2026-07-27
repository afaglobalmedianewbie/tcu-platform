'use client';
import { useState, useEffect } from 'react';

export default function CmsPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('landing');
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: '', speed_mbps: '', price: '', features: '', popular: false, mikrotik_profile: '' });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', subtitle: '', excerpt: '', content: '', author: '' });
  
  const [formData, setFormData] = useState({
    landing_heroTitle: 'Koneksi Internet<br/><span style="color: var(--primary)">Super Cepat & Stabil</span>',
    landing_heroSubtitle: 'Provider Internet Fiber Optic terpercaya di Jawa Barat. Nikmati koneksi internet super cepat mulai dari Rp 155.000/bulan dengan uptime 99.9%.',
    landing_coverage: 'Jaringan Fiber Optic TopClassUniversal.co.id kini hadir di Pangandaran, Banjar, Ciamis, Tasikmalaya, dan Indramayu.',
    landing_wa: '6282319140858',
    
    layanan_internet: 'Layanan Internet Fiber super cepat tanpa batas kuota.',
    layanan_iot: 'Solusi Smart Home dan Internet of Things.',
    layanan_digital: 'Layanan Digital, VPN, dan Cloud Hosting.',
    
    perusahaan_tentang: 'Top Class Universal adalah penyedia layanan internet dan IT profesional.',
    perusahaan_karir: 'Bergabunglah dengan tim kami untuk membangun masa depan digital.',
    perusahaan_tentang_content: '',
    perusahaan_profil_content: '',
    perusahaan_karir_content: '',
    perusahaan_partner_content: '',
    layanan_digital_content: '',
    layanan_iot_content: '',
    
    kontak_alamat: 'Jl. Raya Pangandaran, Jawa Barat',
    kontak_email: 'info@topclassuniversal.co.id',
    kontak_telepon: '0265-123456'
  });

  const fetchPlans = () => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlans(data.plans);
      })
      .catch(console.error);
  };

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPosts(data.posts);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setFormData(prev => ({ ...prev, ...data.data }));
        }
      })
      .catch(console.error);
    fetchPlans();
    fetchPosts();
  }, []);

  const handleUpdatePlan = async (plan) => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch(`/api/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(plan)
      });
      const data = await res.json();
      if (data.success) {
        alert('Paket berhasil diperbarui!');
        fetchPlans();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal memperbarui paket');
    }
  };

  const handleCreatePlan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newPlan.name || !newPlan.price || !newPlan.speed_mbps) {
      alert('Nama paket, Kecepatan, dan Harga wajib diisi!');
      return;
    }
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newPlan)
      });
      const data = await res.json();
      if (data.success) {
        alert('Paket baru berhasil ditambahkan!');
        setNewPlan({ name: '', speed_mbps: '', price: '', features: '', popular: false, mikrotik_profile: '' });
        fetchPlans();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menambahkan paket');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Paket berhasil dihapus!');
        fetchPlans();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menghapus paket');
    }
  };
  const triggerWikiAutopost = async (featureName, description) => {
    try {
      await fetch('/api/wiki-autopost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer TCUSecretKey123' },
        body: JSON.stringify({ featureName, description })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerAutopost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/autopost', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer TCUSecretKey123' }
      });
      const data = await res.json();
      if (data.success) {
        alert(`⚡ Artikel AI berhasil dipublikasikan: "${data.post.title}"!`);
        fetchPosts();
      } else {
        alert('Gagal generate artikel AI');
      }
    } catch (err) {
      alert('Gagal memicu Autopost AI');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newPost.title || !newPost.excerpt || !newPost.content) {
      alert('Judul, Ringkasan, dan Konten wajib diisi!');
      return;
    }
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const data = await res.json();
      if (data.success) {
        alert('Artikel baru berhasil ditambahkan!');
        await triggerWikiAutopost('Publikasi Artikel Blog', `Rilis artikel baru: "${newPost.title}".`);
        setNewPost({ title: '', subtitle: '', excerpt: '', content: '', author: '' });
        fetchPosts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menambahkan artikel');
    }
  };

  const handleDeletePost = async (slug) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert('Artikel berhasil dihapus!');
        fetchPosts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal menghapus artikel');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    const token = localStorage.getItem('tcu_token');
    
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ payload: formData })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Perubahan CMS berhasil disimpan!');
        await triggerWikiAutopost('Pembaruan Konten CMS', 'Pembaruan materi utama dan konfigurasi antarmuka landing page.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('Gagal: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan CMS.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'landing', label: 'Beranda (Landing)' },
    { id: 'layanan', label: 'Teks Layanan' },
    { id: 'paket', label: 'Paket Layanan Fiber' },
    { id: 'perusahaan', label: 'Perusahaan' },
    { id: 'kontak', label: 'Kontak' },
    { id: 'posts', label: 'Artikel & Blog' }
  ];

  return (
    <div className='fade-in-up'>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', color: '#f1f5f9' }}>CMS Website Publik</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Kelola teks dan konten untuk halaman publik tanpa perlu mengubah kode sumber.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
              fontWeight: activeTab === tab.id ? 700 : 500,
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='glass-panel' style={{ maxWidth: '800px', padding: '32px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
        {successMsg && (
          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeTab === 'landing' && (
            <>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Judul Hero (Bisa pakai tag HTML)</label>
                <input type='text' name='landing_heroTitle' value={formData.landing_heroTitle} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Sub-judul Hero</label>
                <textarea name='landing_heroSubtitle' value={formData.landing_heroSubtitle} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', resize: 'vertical' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Teks Area Layanan (Coverage)</label>
                <textarea name='landing_coverage' value={formData.landing_coverage} onChange={handleChange} rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', resize: 'vertical' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Nomor WhatsApp CTA</label>
                <input type='text' name='landing_wa' value={formData.landing_wa} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} />
              </div>
            </>
          )}

          {activeTab === 'layanan' && (
            <>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Deskripsi Internet Fiber</label>
                <textarea name='layanan_internet' value={formData.layanan_internet} onChange={handleChange} rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Deskripsi IoT & Smart Home</label>
                <textarea name='layanan_iot' value={formData.layanan_iot} onChange={handleChange} rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Deskripsi Digital Services</label>
                <textarea name='layanan_digital' value={formData.layanan_digital} onChange={handleChange} rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }}></textarea>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Manajemen Manual Halaman Layanan (Custom HTML)</h3>
                <div className='form-group'>
                  <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Halaman Digital Solutions - Custom HTML</label>
                  <textarea name='layanan_digital_content' value={formData.layanan_digital_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman Digital Solutions..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
                </div>
                <div className='form-group'>
                  <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Halaman IoT Solutions - Custom HTML</label>
                  <textarea name='layanan_iot_content' value={formData.layanan_iot_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman IoT Solutions..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
                </div>
              </div>
            </>
          )}

          {activeTab === 'paket' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Kelola Paket Internet Fiber Aktif</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {plans.map((p, idx) => (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Nama Paket</label>
                          <input type='text' value={p.name} onChange={e => {
                            const updated = [...plans];
                            updated[idx].name = e.target.value;
                            setPlans(updated);
                          }} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Harga (Rp / Bulan)</label>
                          <input type='number' value={parseInt(p.price, 10)} onChange={e => {
                            const updated = [...plans];
                            updated[idx].price = e.target.value;
                            setPlans(updated);
                          }} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Kecepatan (Mbps)</label>
                          <input type='number' value={p.speed_mbps} onChange={e => {
                            const updated = [...plans];
                            updated[idx].speed_mbps = e.target.value;
                            setPlans(updated);
                          }} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Fitur (Pisahkan dengan koma)</label>
                          <input type='text' value={p.features ? p.features.join(', ') : ''} onChange={e => {
                            const updated = [...plans];
                            updated[idx].features = e.target.value.split(',').map(f => f.trim());
                            setPlans(updated);
                          }} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type='checkbox' checked={p.popular} onChange={e => {
                            const updated = [...plans];
                            updated[idx].popular = e.target.checked;
                            setPlans(updated);
                          }} />
                          Tandai sebagai Populer 🔥
                        </label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button type='button' onClick={() => handleDeletePlan(p.id)} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Hapus</button>
                          <button type='button' onClick={() => handleUpdatePlan(p)} style={{ padding: '8px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan Perubahan</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>＋ Tambah Paket Baru</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Nama Paket</label>
                      <input type='text' required value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='Contoh: Starter 20 Mbps' />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Harga (Rp / Bulan)</label>
                      <input type='number' required value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='200000' />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Kecepatan (Mbps)</label>
                      <input type='number' required value={newPlan.speed_mbps} onChange={e => setNewPlan({ ...newPlan, speed_mbps: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='20' />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Fitur (Pisahkan dengan koma)</label>
                      <input type='text' required value={newPlan.features} onChange={e => setNewPlan({ ...newPlan, features: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='Bebas FUP, Support 24/7, Wifi Router' />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Mikrotik Profile (Opsional)</label>
                      <input type='text' value={newPlan.mikrotik_profile} onChange={e => setNewPlan({ ...newPlan, mikrotik_profile: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='starter-20' />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <input type='checkbox' checked={newPlan.popular} onChange={e => setNewPlan({ ...newPlan, popular: e.target.checked })} />
                        Tandai sebagai Populer 🔥
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type='button' onClick={handleCreatePlan} style={{ padding: '10px 24px', background: '#10b981', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>＋ Tambah Paket</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perusahaan' && (
            <>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Tentang Kami - Custom Page HTML</label>
                <textarea name='perusahaan_tentang_content' value={formData.perusahaan_tentang_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman Tentang Kami..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Profil Perusahaan - Custom Page HTML</label>
                <textarea name='perusahaan_profil_content' value={formData.perusahaan_profil_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman Profil Perusahaan..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Karir - Custom Page HTML</label>
                <textarea name='perusahaan_karir_content' value={formData.perusahaan_karir_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman Karir..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Partner - Custom Page HTML</label>
                <textarea name='perusahaan_partner_content' value={formData.perusahaan_partner_content || ''} onChange={handleChange} rows={6} placeholder="Masukkan HTML kustom untuk halaman Partner..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace' }}></textarea>
              </div>
            </>
          )}

          {activeTab === 'kontak' && (
            <>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Alamat Kantor</label>
                <input type='text' name='kontak_alamat' value={formData.kontak_alamat} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Alamat Email</label>
                <input type='email' name='kontak_email' value={formData.kontak_email} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} />
              </div>
              <div className='form-group'>
                <label className='form-label' style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px', display: 'block' }}>Telepon / Hotline</label>
                <input type='text' name='kontak_telepon' value={formData.kontak_telepon} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} />
              </div>
            </>
          )}

          {activeTab === 'posts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Daftar Artikel Blog</h3>
                <button
                  type="button"
                  onClick={handleTriggerAutopost}
                  disabled={loading}
                  style={{
                    padding: '8px 18px',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
                  }}
                >
                  ⚡ Autopost AI Studio
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {posts.map(post => (
                  <div key={post.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 700, color: '#f8fafc' }}>{post.title}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>📅 {post.date} | By {post.author}</p>
                    </div>
                    <button type='button' onClick={() => handleDeletePost(post.slug)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>＋ Buat Artikel Baru</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Judul Artikel</label>
                    <input type='text' required value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='Contoh: Pentingnya Kecepatan Unggah Simetris' />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Sub-judul</label>
                    <input type='text' value={newPost.subtitle} onChange={e => setNewPost({ ...newPost, subtitle: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='Supporting subtitle' />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Penulis (Author)</label>
                    <input type='text' value={newPost.author} onChange={e => setNewPost({ ...newPost, author: e.target.value })} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0' }} placeholder='Tim Redaksi TCU' />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Ringkasan (Excerpt)</label>
                    <textarea required value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', resize: 'vertical' }} placeholder='Penjelasan singkat 2-3 sentences...'></textarea>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Konten Artikel (Bisa pakai HTML)</label>
                    <textarea required value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={8} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', resize: 'vertical' }} placeholder='<p>Konten artikel...</p>'></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button type='button' onClick={handleCreatePost} style={{ padding: '10px 24px', background: '#10b981', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>＋ Buat Artikel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'paket' && activeTab !== 'posts' && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button type='submit' style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan CMS'}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
