
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
