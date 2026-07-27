export class RadiusService {
  async suspendUser(radiusUsername: string) {
    console.log(`[RADIUS] Suspending PPPoE user: ${radiusUsername}`);
    return true;
  }

  async reactivateUser(radiusUsername: string) {
    console.log(`[RADIUS] Reactivating PPPoE user: ${radiusUsername}`);
    return true;
  }

  async createPppoeAccount(username: string, password: string, serviceProfile: string) {
    console.log(`[RADIUS] Creating PPPoE Account for ${username} with profile ${serviceProfile}`);
    return { username, profile: serviceProfile };
  }

  async deletePppoeAccount(username: string) {
    console.log(`[RADIUS] Deleting PPPoE Account for ${username}`);
    return true;
  }

  /**
   * Fetch active PPPoE sessions from FreeRADIUS (radacct table)
   */
  async getActiveSessions() {
    console.log(`[RADIUS] Fetching active PPPoE sessions from radacct`);
    // Simulated DB query for radacct where acctstoptime is NULL
    // e.g. await prisma.radacct.findMany({ where: { acctstoptime: null } })
    return [
      {
        sessionId: 'session_123',
        username: 'user_CST-123',
        ip: '10.8.0.45',
        uptime: '5h 23m',
        downloadBytes: 154039201,
        uploadBytes: 23050123,
        nasIp: '172.29.205.62'
      },
      {
        sessionId: 'session_124',
        username: 'user_CST-124',
        ip: '10.8.0.46',
        uptime: '1d 1h',
        downloadBytes: 1040392010,
        uploadBytes: 530501230,
        nasIp: '172.29.72.49'
      }
    ];
  }
}
