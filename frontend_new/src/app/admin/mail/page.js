'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';

export default function AdminMailPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const { t } = useLanguage();

  const fetchEmails = async () => {
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch('/api/admin/mail', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEmails(data.emails);
        setStats({
          total: data.emails.length,
          active: data.emails.filter(e => e.status === 'active').length
        });
      }
    } catch (err) {
      console.error('Gagal mengambil daftar email:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmails(); }, []);

  const handleChangePassword = async (id, fullEmail) => {
    const newPw = prompt(`Masukkan password baru untuk:\n${fullEmail}`);
    if (!newPw) return;
    if (newPw.length < 6) return alert('Password minimal 6 karakter!');

    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch(`/api/admin/mail/${id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: newPw })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ' + data.message);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('Gagal mengubah password email.');
    }
  };

  const handleDeleteEmail = async (id, fullEmail) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun:\n${fullEmail}?`)) return;
    const token = localStorage.getItem('tcu_token');
    try {
      const res = await fetch(`/api/admin/mail/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ ' + data.message);
        fetchEmails();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('Gagal menghapus akun email.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const quotaPercent = (used, quota) => {
    if (!quota) return 0;
    return Math.min(Math.round((used / quota) * 100), 100);
  };

  return (
    <div className='fade-in-up'>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>📧 {t('webmail')} Server</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
            {t('inbox_account_desc')} — Sinkron dengan MySQL Dovecot
          </p>
        </div>
        <a
          href='/admin/pengaturan/rbac'
          style={{
            padding: '10px 20px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '8px', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600,
            textDecoration: 'none', cursor: 'pointer'
          }}
        >
          + {t('add_customer').replace('Customer', 'Staff').replace('Pelanggan', 'Staf')}
        </a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className='stat-card'>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>{t('email_accounts_total')}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{stats.total}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{t('email_domain_sub')}</div>
        </div>
        <div className='stat-card'>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>{t('active_accounts')}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.active}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{t('dovecot_status_sub')}</div>
        </div>
        <div className='stat-card'>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>{t('mail_server_status')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>SMTP/IMAP Running</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>Postfix + Dovecot + Roundcube</div>
        </div>
      </div>

      {/* Info DKIM */}
      <div style={{
        padding: '14px 20px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <span style={{ fontSize: '1.3rem' }}>🔐</span>
        <div>
          <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.9rem' }}>{t('dkim_active_title')}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            {t('dkim_active_desc')}
          </div>
        </div>
      </div>

      {/* Tabel Akun Email */}
      <div className='glass-panel' style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#f1f5f9' }}>
          {t('inbox_account_list')} — @topclassuniversal.co.id
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>{t('loading')}</div>
        ) : emails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
            <div style={{ color: '#64748b' }}>{t('empty_emails')}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '700px' }}>
              <thead>
                <tr>
                  <th>Alamat Email</th>
                  <th>{t('table_staff_name')}</th>
                  <th>{t('table_quota')}</th>
                  <th>Login Terakhir</th>
                  <th>{t('table_status')}</th>
                  <th>{t('table_action')}</th>
                </tr>
              </thead>
              <tbody>
                {emails.map(e => {
                  const pct = quotaPercent(e.used_mb, e.quota_mb);
                  return (
                    <tr key={e.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{e.full_email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>alias: {e.alias}</div>
                      </td>
                      <td>
                        <div style={{ color: '#cbd5e1' }}>{e.full_name || '—'}</div>
                        {e.role && (
                          <span style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: 600
                          }}>{e.role}</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                          {e.used_mb || 0} MB / {e.quota_mb || 1024} MB
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', width: '120px' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`, borderRadius: '2px',
                            background: pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {formatDate(e.last_login)}
                      </td>
                      <td>
                        <span className={`badge ${e.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {e.status === 'active' ? t('active') : 'Nonactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleChangePassword(e.id, e.full_email)}
                            style={{
                              padding: '6px 12px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                              borderRadius: '6px', color: '#60a5fa', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
                            }}
                          >
                            {t('btn_change_password')}
                          </button>
                          <button
                            onClick={() => handleDeleteEmail(e.id, e.full_email)}
                            style={{
                              padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: '6px', color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
                            }}
                          >
                            {t('btn_delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Webmail link */}
      <div style={{
        marginTop: '20px', padding: '14px 20px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{t('webmail_access_title')}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
            {t('webmail_access_desc')}
          </div>
        </div>
        <a
          href='/admin/webmail'
          style={{
            padding: '8px 18px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none'
          }}
        >
          {t('btn_open_webmail')}
        </a>
      </div>
    </div>
  );
}
