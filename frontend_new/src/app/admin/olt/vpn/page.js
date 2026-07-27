
'use client';
import { useState } from 'react';
export default function AddVpn() {
  const [status, setStatus] = useState('');
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Add VPN Client</h2>
      <div className="card" style={{ maxWidth: '500px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Nama VPN</label>
            <input type="text" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>IP Server (pptp/sstp/l2tp)</label>
            <input type="text" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Username</label>
            <input type="text" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" style={{ width: '100%' }} />
          </div>
          <button className="btn-primary" onClick={() => setStatus('Connected')}>Connect to Router/MikroTik</button>
        </div>
      </div>
      {status && (
        <div className="card" style={{ background: 'var(--olt-success)', color: '#000', marginBottom: '24px' }}>
          VPN Remote IP: 10.10.10.5 - {status}
        </div>
      )}
      <div className="card">
        <h3>VPN Accounts</h3>
        <table style={{ marginTop: '16px' }}>
          <thead>
            <tr><th>No</th><th>Nama VPN</th><th>Username</th><th>IP Remote</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Site A</td><td>sitea_vpn</td><td>10.10.10.2</td><td style={{ color: 'var(--olt-success)' }}>Connected</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
