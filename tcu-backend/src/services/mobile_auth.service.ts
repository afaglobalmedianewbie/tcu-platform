import jwt from 'jsonwebtoken';

export class MobileAuthService {
  private JWT_SECRET = process.env.JWT_SECRET || 'supersecret_tcu_2026';

  async login(payload: any) {
    const { phone, password } = payload;
    
    // Simulate DB user validation
    if (phone === '08123456789' && password === '123456') {
      const user = { id: 'cust1', role: 'CUSTOMER', name: 'John Doe' };
      // Generate mobile JWT token (expires in 30 days)
      const token = jwt.sign(user, this.JWT_SECRET, { expiresIn: '30d' });
      return { success: true, token, user };
    }
    
    throw new Error('Invalid credentials');
  }

  async register(payload: any) {
    // Simulate Customer creation logic mapping to CRM
    console.log(`[MobileAuth] Registering new mobile user: ${payload.phone}`);
    return { success: true, message: 'Registration successful' };
  }
}
