const fs = require('fs');
const path = require('path');

const basePath = '/home/tcu/frontend_new/src/app/admin/olt';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(basePath);
ensureDir(path.join(basePath, 'login'));
ensureDir(path.join(basePath, 'vpn'));
ensureDir(path.join(basePath, 'add'));
ensureDir(path.join(basePath, 'manage'));
ensureDir(path.join(basePath, 'logs'));

const cssContent = `
.olt-theme {
  --olt-bg: #0E1A2B;
  --olt-primary: #1E90FF;
  --olt-success: #00C853;
  --olt-danger: #FF5252;
  --olt-warning: #FFC107;
  --olt-purple: #9C27B0;
  --olt-text: #E0E0E0;
  --olt-panel: #16243A;
  
  background-color: var(--olt-bg);
  color: var(--olt-text);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  min-height: 100vh;
}
.olt-theme input, .olt-theme select {
  background: #111D2F;
  border: 1px solid #2A3B55;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
}
.olt-theme button.btn-primary {
  background: var(--olt-primary);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.olt-theme .card {
  background: var(--olt-panel);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
.olt-theme table {
  width: 100%;
  border-collapse: collapse;
}
.olt-theme th, .olt-theme td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #2A3B55;
}
.olt-theme th {
  background: #1A2A42;
}
.olt-sidebar {
  width: 250px;
  background: #101B2B;
  border-right: 1px solid #2A3B55;
  padding: 20px;
}
.olt-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
`;

fs.writeFileSync(path.join(basePath, 'olt.css'), cssContent);

const layoutContent = `
import './olt.css';
import Link from 'next/link';

export default function OltLayout({ children }) {
  return (
    <div className="olt-theme" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', background: '#101B2B', borderBottom: '1px solid #2A3B55' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>TCU OLT Management</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#00C853' }}>✅ VPN Connected</span>
          <span style={{ color: '#00C853' }}>✅ SNMP Active</span>
          <span style={{ color: '#00C853' }}>✅ ACS Active</span>
          <span style={{ marginLeft: '16px' }}>Admin</span>
          <Link href="/admin/olt/login" style={{ color: '#FF5252' }}>Logout</Link>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="olt-sidebar">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/admin/olt" style={{ color: '#1E90FF', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/admin/olt/vpn" style={{ color: '#1E90FF', textDecoration: 'none' }}>Add VPN Client</Link>
            <Link href="/admin/olt/add" style={{ color: '#1E90FF', textDecoration: 'none' }}>Add OLT</Link>
            <Link href="/admin/olt/manage" style={{ color: '#1E90FF', textDecoration: 'none' }}>OLT Management</Link>
            <Link href="/admin/olt/logs" style={{ color: '#1E90FF', textDecoration: 'none' }}>Logs & Reports</Link>
          </nav>
        </aside>
        <main className="olt-main">
          {children}
        </main>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'layout.js'), layoutContent);

const dashboardContent = `
'use client';
export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>GenieACS Management (TR-069/MVC)</h3>
          <button className="btn-primary" style={{ marginTop: '16px' }}>Open Workflow</button>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>SNMP VPN Monitoring</h3>
          <button className="btn-primary" style={{ marginTop: '16px' }}>Open Workflow</button>
        </div>
      </div>
      <div className="card">
        <h3>Topology</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '40px 20px', justifyContent: 'center' }}>
          <div className="card" style={{ background: '#1A2A42' }}>Cloud</div>
          <div style={{ height: '4px', width: '60px', background: 'var(--olt-purple)' }}></div>
          <div className="card" style={{ background: '#1A2A42' }}>MikroTik Router</div>
          <div style={{ height: '4px', width: '60px', background: 'var(--olt-purple)' }}></div>
          <div className="card" style={{ background: '#1A2A42' }}>OLT (uplink, mgt1)</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label>Uplink Selection: </label>
          <select style={{ marginLeft: '10px' }}>
            <option>UPLINK_PDH</option>
            <option>UPLINK_MNJ05</option>
            <option>UPLINK_PH02</option>
            <option>UPLINK_KALIPUCANG</option>
          </select>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'page.js'), dashboardContent);

const vpnContent = `
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
`;
fs.writeFileSync(path.join(basePath, 'vpn', 'page.js'), vpnContent);

const addOltContent = `
'use client';
export default function AddOlt() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Add OLT Device</h2>
      <div className="card" style={{ maxWidth: '500px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Nama OLT</label>
            <input type="text" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Jenis/Brand OLT</label>
            <select style={{ width: '100%' }}>
              <option>ZTE</option>
              <option>Huawei</option>
              <option>VSOL</option>
              <option>Fiberhome</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Host (IP from VPN)</label>
            <input type="text" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Read Community (SNMP RO)</label>
            <input type="text" defaultValue="tcuro" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Write Community (SNMP RW)</label>
            <input type="text" defaultValue="tcurw" style={{ width: '100%' }} />
          </div>
          <button className="btn-primary">Add OLT Device</button>
        </div>
      </div>
      <div className="card">
        <h3>OLT Devices</h3>
        <table style={{ marginTop: '16px' }}>
          <thead>
            <tr><th>No</th><th>Nama</th><th>Jenis</th><th>Host</th><th>SNMP RO</th><th>SNMP RW</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>OLT Pusat</td><td>ZTE</td><td>10.10.10.10</td><td>tcuro</td><td>tcurw</td><td><button>Edit</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'add', 'page.js'), addOltContent);

const manageOltContent = `
'use client';
import { useState } from 'react';
export default function ManageOlt() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deploying, setDeploying] = useState(false);
  
  const handleSave = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      alert('Configuration deployed successfully');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select><option>UPLINK_PDH</option><option>UPLINK_MNJ05</option></select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="card" style={{ flex: 1, borderTop: '4px solid var(--olt-primary)' }}>Waiting Authorization</div>
          <div className="card" style={{ flex: 1, borderTop: '4px solid var(--olt-success)' }}>Online (142)</div>
          <div className="card" style={{ flex: 1, borderTop: '4px solid var(--olt-danger)' }}>Offline (3)</div>
          <div className="card" style={{ flex: 1, borderTop: '4px solid var(--olt-warning)' }}>Low Signals (12)</div>
        </div>
        <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>ONU Devices</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ background: '#2A3B55' }}>+ Add Unauthenticated</button>
              <select><option>Profile: T-CONT</option><option>GEM-Port</option><option>WAN VLAN</option></select>
              <button className="btn-primary" onClick={handleSave}>SaveCfg</button>
              <button className="btn-primary" style={{ background: 'var(--olt-purple)' }} onClick={() => setShowAdvanced(true)}>Advanced</button>
            </div>
          </div>
          {deploying && <div style={{ color: 'var(--olt-primary)', marginBottom: '10px' }}>Deployment in progress...</div>}
          <table>
            <thead><tr><th>Onu ID</th><th>Name</th><th>Type</th><th>SN/Mac</th><th>Status</th><th>Rx Power</th></tr></thead>
            <tbody>
              <tr><td>1/1/1:1</td><td>Cust_A</td><td>F609</td><td>ZTEGC12345</td><td style={{color: 'var(--olt-success)'}}>Online</td><td>-19.5 dBm</td></tr>
              <tr><td>1/1/1:2</td><td>Cust_B</td><td>F660</td><td>ZTEGC99887</td><td style={{color: 'var(--olt-danger)'}}>Offline</td><td>-</td></tr>
              <tr><td>1/1/1:3</td><td>Cust_C</td><td>F609</td><td>ZTEGCAABB1</td><td style={{color: 'var(--olt-warning)'}}>Low Signal</td><td>-28.1 dBm</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="card" style={{ flex: 1 }}>
        <h3>ONU Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div><label style={{ fontSize: '0.8rem', color: '#888' }}>Interface</label><div style={{ background: '#111D2F', padding: '8px' }}>1/1/1:1</div></div>
          <div><label style={{ fontSize: '0.8rem', color: '#888' }}>Name</label><input type="text" defaultValue="Cust_A" style={{ width: '100%', boxSizing: 'border-box' }}/></div>
          <div><label style={{ fontSize: '0.8rem', color: '#888' }}>SN/Mac/Loid</label><input type="text" defaultValue="ZTEGC12345" style={{ width: '100%', boxSizing: 'border-box' }}/></div>
          <div><label style={{ fontSize: '0.8rem', color: '#888' }}>Rx Power OLT Side</label><div style={{ color: 'var(--olt-success)' }}>-19.5 dBm</div></div>
          
          <h4 style={{ marginTop: '20px' }}>Configuration Tools</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>⚙️ T-CONT</button>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>⚙️ GEM-Port</button>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>⚙️ VLAN</button>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>⚙️ WAN IP</button>
          </div>
        </div>
      </div>
      
      {showAdvanced && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(16,32,64,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px' }}>
            <h2>Advanced Configuration</h2>
            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label><input type="checkbox" defaultChecked /> Minimal Licence Radius Basic</label>
              <label><input type="checkbox" defaultChecked /> Create VPN Connection</label>
              <label><input type="checkbox" defaultChecked /> Read and Write Community SNMP</label>
              <label><input type="checkbox" defaultChecked /> ZTE C300, C320, C350 | v2.x / v4.x</label>
              <div style={{ padding: '10px', background: '#111D2F', color: 'var(--olt-purple)', textAlign: 'center', marginTop: '10px' }}>
                Cloud ➔ MikroTik ➔ OLT
              </div>
            </div>
            <button className="btn-primary" onClick={() => setShowAdvanced(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'manage', 'page.js'), manageOltContent);

const logsContent = `
'use client';
export default function Logs() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Logs & Reports</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select><option>All OLTs</option></select>
            <select><option>All Status</option></select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>Export CSV</button>
            <button className="btn-primary" style={{ background: '#2A3B55' }}>Export JSON</button>
          </div>
        </div>
        <table>
          <thead><tr><th>Time</th><th>Event</th><th>Target</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>2026-07-15 12:00:01</td><td>CLI Auto-Deploy: SaveCfg</td><td>OLT Pusat</td><td style={{color: 'var(--olt-success)'}}>Success</td></tr>
            <tr><td>2026-07-15 11:45:22</td><td>VPN Connect</td><td>MikroTik-A</td><td style={{color: 'var(--olt-success)'}}>Connected (10.10.10.5)</td></tr>
            <tr><td>2026-07-15 10:12:05</td><td>SNMP Polling (Rx Power)</td><td>ZTEGC12345</td><td style={{color: 'var(--olt-warning)'}}>Warning (-28.1 dBm)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'logs', 'page.js'), logsContent);

const loginContent = `
'use client';
import { useRouter } from 'next/navigation';
import './../olt.css';

export default function OltLogin() {
  const router = useRouter();
  
  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/admin/olt');
  };

  return (
    <div className="olt-theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
        <h2 style={{ marginBottom: '8px' }}>TCU OLT Management</h2>
        <p style={{ color: '#888', marginBottom: '24px' }}>Operator & Admin Login</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(basePath, 'login', 'page.js'), loginContent);

