
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
