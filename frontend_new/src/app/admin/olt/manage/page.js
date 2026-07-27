
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
