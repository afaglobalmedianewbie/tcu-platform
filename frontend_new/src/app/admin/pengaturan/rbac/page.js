'use client';
import { useState, useEffect } from 'react';

const MENU_SECTIONS = [
  { section: 'MAIN', items: ['Dashboard', 'FTTH Management'] },
  { section: 'CRM', items: ['Customers', 'Leads', 'Tickets', 'Finance', 'Messages'] },
  { section: 'COMPANY', items: ['Networking', 'Scheduling', 'Inventory', 'Tariff Plans'] },
  { section: 'SYSTEM', items: ['Administrasi', 'Konfigurasi', 'CMS Web', 'Disaster Recovery', 'Webmail', 'RBAC', 'Knowledgebase'] }
];

const ROLES = ['SUPERADMIN', 'ADMIN', 'CS', 'NOC', 'FINANCE', 'SALES', 'TECHNICIAN', 'CUSTOMER'];

const ALL_ITEMS = MENU_SECTIONS.flatMap(s => s.items);

const DEFAULT_RBAC = {
  SUPERADMIN: ALL_ITEMS,
  ADMIN: ALL_ITEMS.filter(item => item !== 'Disaster Recovery'),
  CS: ['Dashboard', 'Customers', 'Tickets', 'Leads', 'Messages', 'Knowledgebase'],
  NOC: ['Dashboard', 'FTTH Management', 'Networking', 'Tickets', 'Knowledgebase'],
  FINANCE: ['Dashboard', 'Finance', 'Tariff Plans', 'Knowledgebase'],
  SALES: ['Dashboard', 'Leads', 'Knowledgebase'],
  TECHNICIAN: ['Dashboard', 'Networking', 'Inventory', 'Scheduling', 'Tickets', 'Knowledgebase'],
  CUSTOMER: ['Dashboard', 'Finance', 'Tickets', 'Knowledgebase']
};

export default function RbacSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // stores the role being saved
  const [rbac, setRbac] = useState(DEFAULT_RBAC);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('tcu_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setIsSuperAdmin(user && (user.role === 'SUPERADMIN' || user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo'));
      }
    } catch(e) {}

    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.rbac_settings) {
          try {
            let parsed = typeof data.data.rbac_settings === 'string' ? JSON.parse(data.data.rbac_settings) : data.data.rbac_settings;
            setRbac({ ...DEFAULT_RBAC, ...parsed });
          } catch(e) {}
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = (role, item) => {
    if (role === 'SUPERADMIN' && !isSuperAdmin) return; // Immutable for non-SuperAdmin
    if (role === 'ADMIN' && !isSuperAdmin) return; // Admin role permissions can only be edited by Super Admin
    setRbac(prev => {
      const rolePerms = prev[role] || [];
      const newPerms = rolePerms.includes(item) 
        ? rolePerms.filter(p => p !== item)
        : [...rolePerms, item];
      return { ...prev, [role]: newPerms };
    });
  };

  const handleSave = async (role) => {
    setSaving(role);
    try {
      const token = localStorage.getItem('tcu_token');
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ payload: { rbac_settings: rbac } })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Pengaturan RBAC untuk ${role} berhasil disimpan!`);
      } else {
        alert('Gagal menyimpan: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan.');
    }
    setSaving(null);
  };

  if (loading) return <div style={{ color: '#94a3b8', padding: '20px' }}>Memuat konfigurasi RBAC...</div>;

  const allItems = MENU_SECTIONS.flatMap(s => s.items);

  return (
    <div style={{ backgroundColor: '#0E1A2B', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: '"Segoe UI", Inter, sans-serif' }}>
      <style>{`
        .rbac-table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .rbac-table th { background: rgba(30, 144, 255, 0.1); padding: 16px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.05); color: #1E90FF; position: sticky; top: 0; z-index: 10; }
        .rbac-table th:first-child { text-align: left; }
        .rbac-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center; vertical-align: middle; }
        .rbac-table td:first-child { text-align: left; font-weight: 500; color: #e2e8f0; }
        .rbac-table tr:hover td { background: rgba(255,255,255,0.03); }
        
        /* Custom Checkbox */
        .custom-checkbox {
          width: 20px; height: 20px;
          accent-color: #1E90FF;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .custom-checkbox:hover:not(:disabled) {
          transform: scale(1.15);
          box-shadow: 0 0 10px rgba(30, 144, 255, 0.4);
        }
        .custom-checkbox:disabled {
          opacity: 0.5; cursor: not-allowed;
        }

        .btn-simpan {
          background: #1E90FF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        .btn-simpan:hover {
          background: #0077ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(30, 144, 255, 0.4);
        }
        .btn-simpan:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
        }
        
        .footer-note {
          margin-top: 16px;
          padding: 12px;
          background: rgba(0, 200, 83, 0.1);
          border-left: 4px solid #00C853;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #00C853;
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Role-Based Access Control (RBAC) Matrix</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Atur hak akses menu dashboard untuk seluruh 8 peran sistem (Superadmin, Admin, CS, NOC, Finance, Sales, Teknisi, & Customer).</p>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <table className="rbac-table">
          <thead>
            <tr>
              <th>Permission Menu</th>
              {ROLES.map(role => (
                <th key={role}>{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allItems.map(item => (
              <tr key={item}>
                <td>{item}</td>
                {ROLES.map(role => {
                  const isDisabled = (role === 'SUPERADMIN' && !isSuperAdmin) || (role === 'ADMIN' && !isSuperAdmin);
                  const isChecked = (rbac[role] || []).includes(item);
                  return (
                    <td key={role}>
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={() => handleToggle(role, item)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Bottom Row for Save Buttons */}
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <td style={{ fontWeight: 700, color: '#94a3b8' }}>Aksi Simpan Matrix</td>
              {ROLES.map(role => {
                const isActionDisabled = (role === 'SUPERADMIN' && !isSuperAdmin) || (role === 'ADMIN' && !isSuperAdmin);
                return (
                  <td key={role}>
                    <button 
                      className="btn-simpan"
                      onClick={() => handleSave(role)}
                      disabled={saving !== null || isActionDisabled}
                      style={{ opacity: isActionDisabled ? 0.3 : 1 }}
                    >
                      {saving === role ? '...' : 'Simpan'}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="footer-note">
        <strong>INFO:</strong> Matrix RBAC lengkap mencakup 8 Role Sistem. Hak akses SUPERADMIN memiliki kontrol penuh atas seluruh modul (termasuk Disaster Recovery & Failover). Hak akses ADMIN hanya dapat dikelola oleh Super Admin.
      </div>
    </div>
  );
}
