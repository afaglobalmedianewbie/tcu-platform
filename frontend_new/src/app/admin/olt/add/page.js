
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
