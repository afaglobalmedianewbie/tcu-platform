'use client';
import { useState } from 'react';

export default function PaymentGatewayPage() {
  const [activeTab, setActiveTab] = useState('mandiri'); // 'owned' or 'mandiri'
  const [adminFee, setAdminFee] = useState('5000');
  const [useWa, setUseWa] = useState(true);
  const [useAndroid, setUseAndroid] = useState(true);

  // Channels
  const [channels, setChannels] = useState({
    MANDIRI: true, BCA: true, BRI: true, BNI: true, BSI: true, BJB: false, CIMB: false, PERMATA: false, BSS: false,
    GOPAY: true, DANA: true, LINKAJA: false, OVO: true, SHOPEEPAY: true, QRIS: true,
    ALFAMART: true, INDOMARET: true
  });

  const toggleChannel = (key) => setChannels(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      
      {/* Top Banner Notice */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(37,99,235,0.15) 0%, rgba(15,23,42,0) 100%)',
        borderLeft: '4px solid var(--primary)',
        padding: '16px 20px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid var(--glass-border)'
      }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#e2e8f0', fontWeight: 600 }}>
            Pembaruan Ketentuan Layanan TCU Platform
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Fitur Payment Gateway - Sub-Account Xendit (Xenplatform) Type OWNED.
          </p>
        </div>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          Baca Selengkapnya
        </button>
      </div>

      {/* Tabs / Type Selector */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('owned')}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: activeTab === 'owned' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'owned' ? '#fff' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}>
          Xenplatform (OWNED)
        </button>
        <button 
          onClick={() => setActiveTab('mandiri')}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: activeTab === 'mandiri' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'mandiri' ? '#fff' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}>
          Xendit (MANDIRI)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Status Header */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>Xendit Payment Gateway</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                  {activeTab === 'owned' ? (
                    <span className="badge badge-success">Activated (LIVE)</span>
                  ) : (
                    <span className="badge badge-danger">Not Activated</span>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {activeTab === 'mandiri' && (
                <button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Apply Now
                </button>
              )}
              <button className="btn-primary" style={{ padding: '10px 20px' }}>
                Configuration
              </button>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              Configuration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>ID Bisnis</label>
                <input type="text" className="form-input" placeholder="Masukkan ID Bisnis Xendit" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Token verifikasi webhook</label>
                <input type="password" className="form-input" placeholder="Webhook Verification Token" style={{ width: '100%' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Secret Key</label>
                <input type="password" className="form-input" placeholder="xnd_production_..." style={{ width: '100%' }} />
              </div>
            </div>

            {/* Admin Fee & Notification Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>Setting Admin Fee</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  If charge of bank / payment gateway fees for your customers, please specify the nominal amount. Default '0' costs are charged by you.
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>Rp</span>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={adminFee}
                    onChange={(e) => setAdminFee(e.target.value)}
                    style={{ width: '100%', paddingLeft: '45px', fontSize: '1.1rem', fontWeight: 600 }} 
                  />
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>Payment Method Use</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Select where the payment method will be available. Uncheck if don't need.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={useWa} onChange={() => setUseWa(!useWa)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Whatsapp Notification</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={useAndroid} onChange={() => setUseAndroid(!useAndroid)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Android Application</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bank Account */}
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>Account Bank</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Account bank for Withdraw your Balance</p>
              
              <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Bank Name</th>
                      <th>Account Name</th>
                      <th>Account Number</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No bank accounts registered. <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', marginLeft: '8px' }}>+ Add Bank</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Webhook Instructions */}
            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3b82f6', margin: 0 }}>Webhook Integration</h4>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid rgba(37,99,235,0.3)', color: '#3b82f6' }}>Lihat Contoh</button>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value="https://webhook.topclassuniversal.co.id/xendit/payment_request" 
                  style={{ flex: 1, padding: '12px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.9rem' }}
                />
                <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: 600, cursor: 'pointer' }}>
                  Copy
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Instruksi langkah:</div>
                <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Salin URL webhook di atas.</li>
                  <li>Masuk ke dashboard Xendit, lalu pilih menu <strong>Settings</strong>.</li>
                  <li>Input URL Webhook ke <strong>/v3/payment_requests</strong> (kolom Status Pembayaran) atau <strong>Payments API</strong> (kolom Status Pembayaran).</li>
                </ol>
              </div>
            </div>

            {/* Payment Channels */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: '#e2e8f0' }}>Payment Channel</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Select the channel to be used and make sure the selected channel is active on the Xendit dashboard.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                {Object.entries(channels).map(([key, active]) => (
                  <label key={key} style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                    background: active ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)',
                    border: active ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '12px 16px', borderRadius: '8px', transition: 'all 0.2s'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={active} 
                      onChange={() => toggleChannel(key)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 400, color: active ? '#fff' : 'var(--text-muted)' }}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
              <button style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button className="btn-primary" style={{ padding: '12px 40px', borderRadius: '8px', fontSize: '1rem' }}>
                Save Configuration
              </button>
            </div>

          </div>
        </div>

        {/* Right Sidebar - Balance */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Account Balance</h4>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Available Balance</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                  Rp 0
                </div>
              </div>
            </div>

            <button style={{ 
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              color: '#e2e8f0', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Withdraw Funds
            </button>
            
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Pending Settlement</span>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Rp 0</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Withdrawal</span>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>-</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
