const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class VpnService {
  /**
   * Register a VPN Client in FreeRADIUS and Internal DB
   */
  async createVpnClient({ username, password, name, server }) {
    try {
      // Create user in FreeRADIUS radcheck table for PPPoE/L2TP/SSTP auth
      // We assume standard Cleartext-Password attribute
      await prisma.radCheck.create({
        data: {
          username: username,
          attribute: 'Cleartext-Password',
          op: ':=',
          value: password
        }
      });

      // Optionally we could add Framed-IP-Address in radreply here 
      // if we want to assign a static VPN IP to the Mikrotik.
      // For this example, we'll let RADIUS/VPN server assign it dynamically 
      // or we simulate the assigned IP.
      const simulatedRemoteIp = '10.10.10.' + Math.floor(Math.random() * (254 - 2 + 1) + 2); 

      // Save VPN record to TCU internal DB for UI monitoring
      await prisma.vpnClient.create({
        data: {
          name: name,
          username: username,
          password: password,
          server_ip: server,
          remote_ip: simulatedRemoteIp,
          status: 'ready'
        }
      });

      // Log the event
      await prisma.networkLog.create({
        data: {
          event: 'VPN Client Registered',
          target: name,
          detail: `Added to RADIUS radcheck. Awaiting dial-in to ${server}`,
          status: 'success'
        }
      });

      return {
        remote_ip: simulatedRemoteIp,
        status: 'ready',
        message: 'VPN credentials added to RADIUS'
      };

    } catch (error) {
      console.error('RADIUS VPN creation Error:', error);
      throw new Error('VPN creation failed');
    }
  }
}

module.exports = new VpnService();
