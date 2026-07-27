const { prisma, syncEmailAliasToMailDb, sendEmail, mailDbConfig, md5CryptDovecot } = require('../utils/helpers');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const os = require('os');

function isSuperAdminUser(user) {
  if (!user) return false;
  return user.role === 'SUPERADMIN' || user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo';
}

function checkSuperAdminAccess(targetUser, requestingUser, action = 'merubah') {
  if (isSuperAdminUser(targetUser) && !isSuperAdminUser(requestingUser)) {
    throw new Error(`Admin tidak memiliki hak akses untuk ${action} Super Admin.`);
  }
}

async function assignUserRole(userId, roleName) {
  if (!userId || !roleName) return;
  try {
    let roleRecord = await prisma.role.findUnique({ where: { name: roleName } });
    if (!roleRecord) {
      roleRecord = await prisma.role.create({ data: { name: roleName, description: `Role ${roleName}` } });
    }
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.userRole.create({ data: { userId, roleId: roleRecord.id } });
  } catch (err) {
    console.error('Failed to assign user role:', err.message);
  }
}

class AdminService {
  async getSystemStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramPercent = Math.round((usedMem / totalMem) * 100);

    const loadAvg = os.loadavg();
    const cpuCores = os.cpus().length;
    const cpuPercent = Math.min(100, Math.round((loadAvg[0] / cpuCores) * 100));

    const disk = { total: '100 GB', used: '25 GB', free: '75 GB', percent: 25 };
    const containers = [];
    const networkConnections = 0;

    return {
      cpuPercent,
      ramPercent,
      ramUsedGb: (usedMem / (1024 * 1024 * 1024)).toFixed(2),
      ramTotalGb: (totalMem / (1024 * 1024 * 1024)).toFixed(2),
      uptime: os.uptime(),
      disk,
      containers,
      networkConnections
    };
  }

  async getAuditLogs() {
    const logs = await prisma.auditLog.findMany({
      orderBy: { created_at: 'desc' },
      take: 100
    });

    const userIds = [...new Set(logs.map(l => l.user_id).filter(Boolean))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, full_name: true }
    });

    const userMap = new Map(users.map(u => [u.id, u]));
    return logs.map(l => ({
      id: l.id.toString(),
      action: l.action,
      endpoint: l.endpoint,
      method: l.method,
      ip_address: l.ip_address || '127.0.0.1',
      user_agent: l.user_agent ? l.user_agent.substring(0, 100) : 'Unknown',
      created_at: l.created_at,
      user: l.user_id ? userMap.get(l.user_id) || { email: 'Unknown', full_name: 'Unknown' } : { email: 'System', full_name: 'System/Cron' }
    }));
  }

  async manageUsers({ username, password, role, full_name, phone, email, address }, requestingUser) {
    if (role === 'SUPERADMIN' && !isSuperAdminUser(requestingUser)) {
      throw new Error('Hanya Super Admin yang dapat membuat akun dengan role SUPERADMIN.');
    }

    const cleanAlias = (username || '').replace(/@topclassuniversal\.co\.id$/i, '').trim();
    let finalEmail = (email || `${cleanAlias}@topclassuniversal.co.id`).trim();
    if (!finalEmail.endsWith('@topclassuniversal.co.id')) {
      const emailPrefix = finalEmail.split('@')[0];
      finalEmail = `${emailPrefix}@topclassuniversal.co.id`;
    }

    const emailExists = await prisma.user.findFirst({ where: { email: finalEmail } });
    if (emailExists) throw new Error('Email sudah terdaftar');

    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) throw new Error('Nomor telepon sudah terdaftar');
    }

    const usernameExists = await prisma.user.findFirst({ where: { username: cleanAlias } });
    if (usernameExists) throw new Error('Username sudah digunakan');

    const password_hash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: finalEmail,
        phone: phone || null,
        password_hash,
        username: cleanAlias,
        full_name,
        address
      }
    });

    await assignUserRole(newUser.id, role || 'ADMIN');
    await syncEmailAliasToMailDb(newUser.email, newUser.username, password);

    const subject = 'Aktivasi Akun Layanan TCU Platform';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px; backgroundColor: #0f172a; color: #f8fafc;">
        <h2 style="color: #3b82f6; borderBottom: 1px solid #3b82f6; paddingBottom: 10px;">Aktivasi Akun Staff TCU Platform</h2>
        <p>Halo <strong>${full_name}</strong>,</p>
        <p>Akun staff Anda untuk sistem <strong>TCU Platform (PT Top Class Universal)</strong> telah berhasil dibuat dengan peran/akses sebagai <strong>${role || 'ADMIN'}</strong>.</p>
        <p>Berikut adalah kredensial akun Anda:</p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; borderRadius: 6px; margin: 15px 0;">
          <table style="width: 100%;">
            <tr><td style="width: 120px; color: #94a3b8;">Username:</td><td style="fontWeight: bold; color: #f8fafc;">${cleanAlias}</td></tr>
            <tr><td style="color: #94a3b8;">Email:</td><td style="fontWeight: bold; color: #3b82f6;">${finalEmail}</td></tr>
            <tr><td style="color: #94a3b8;">Password:</td><td style="fontWeight: bold; color: #f8fafc;">[ Gunakan password yang ditetapkan administrator ]</td></tr>
            <tr><td style="color: #94a3b8;">Akses Role:</td><td style="fontWeight: bold; color: #3b82f6;">${role || 'ADMIN'}</td></tr>
          </table>
        </div>
        <p>Silakan masuk ke dasbor dan segera lakukan aktivasi/pengaturan 2FA untuk mengamankan akun Anda.</p>
        <hr style="border: 0; borderTop: 1px solid #334155; margin: 20px 0;" />
        <p style="fontSize: 0.85rem; color: #64748b;">Pesan otomatis ini dikirim oleh server TCU Platform.<br/>Alamat Server: activation@topclassuniversal.co.id</p>
      </div>
    `;

    await sendEmail(finalEmail, subject, html, '"TCU Activation Server" <activation@topclassuniversal.co.id>');

    return newUser;
  }

  async updateUserPassword(userId, password, requestingUser) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } }
    });
    if (!targetUser) throw new Error('User tidak ditemukan.');
    const primaryRole = (targetUser.userRoles && targetUser.userRoles.length > 0 && targetUser.userRoles[0].role) ? targetUser.userRoles[0].role.name : (targetUser.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
    checkSuperAdminAccess({ ...targetUser, role: primaryRole }, requestingUser, 'merubah password');

    const password_hash = await bcrypt.hash(password, 12);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password_hash }
    });

    await syncEmailAliasToMailDb(updatedUser.email, updatedUser.username, password);
    return updatedUser;
  }

  async getMailAccounts() {
    let conn;
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          full_name: true,
          address: true,
          preferences: true,
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });
      const userMap = {};
      users.forEach(u => {
        const primaryRole = (u.userRoles && u.userRoles.length > 0 && u.userRoles[0].role) ? u.userRoles[0].role.name : (u.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
        if (u.email) userMap[u.email.toLowerCase()] = { ...u, role: primaryRole };
      });

      conn = await mysql.createConnection(mailDbConfig);
      const [rows] = await conn.execute(
        `SELECT id, alias, full_email, status, quota_mb, used_mb, last_login, created_at FROM email_aliases ORDER BY created_at DESC`
      );

      return rows.map(r => {
        const u = (r.full_email && userMap[r.full_email.toLowerCase()]) || {};
        let ktp = u.preferences && typeof u.preferences === 'object' ? u.preferences.ktp : '';
        return {
          id: r.id,
          alias: r.alias || (r.full_email ? r.full_email.split('@')[0] : ''),
          full_email: r.full_email,
          username: u.username || r.alias || (r.full_email ? r.full_email.split('@')[0] : ''),
          full_name: u.full_name || 'Staff TCU',
          role: u.role || 'ADMIN',
          phone: u.phone || '-',
          address: u.address || '-',
          ktp: ktp || '-',
          status: r.status,
          quota_mb: r.quota_mb || 1024,
          used_mb: r.used_mb || 0,
          last_login: r.last_login || null,
          created_at: r.created_at || null,
          user_id: u.id || null
        };
      });
    } finally {
      if (conn) await conn.end();
    }
  }

  async createMailAccount({ username, alias, password, role, full_name, ktp, address, phone }, requestingUser) {
    const rawAlias = (username || alias || '').trim();
    if (!rawAlias || !password) throw new Error('Username/Alias dan Password wajib diisi.');

    const cleanAlias = rawAlias.replace(/@topclassuniversal\.co\.id$/i, '').trim();
    if (!cleanAlias) throw new Error('Username/Alias tidak valid.');

    if (role === 'SUPERADMIN' && !isSuperAdminUser(requestingUser)) {
      throw new Error('Hanya Super Admin yang dapat membuat akun dengan role SUPERADMIN.');
    }

    const email = `${cleanAlias}@topclassuniversal.co.id`;
    const userRole = role || 'ADMIN';

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: cleanAlias }] },
      include: { userRoles: { include: { role: true } } }
    });

    if (existingUser) {
      const primaryRole = (existingUser.userRoles && existingUser.userRoles.length > 0 && existingUser.userRoles[0].role) ? existingUser.userRoles[0].role.name : (existingUser.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
      checkSuperAdminAccess({ ...existingUser, role: primaryRole }, requestingUser, 'merubah');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const prefObj = ktp ? { ktp } : null;

    let targetUser = existingUser;
    if (existingUser) {
      targetUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          full_name: full_name || existingUser.full_name,
          address: address || existingUser.address,
          phone: phone || existingUser.phone,
          password_hash: hashedPassword,
          ...(prefObj ? { preferences: prefObj } : {})
        }
      });
    } else {
      targetUser = await prisma.user.create({
        data: {
          email,
          username: cleanAlias,
          full_name: full_name || cleanAlias,
          address: address || '',
          phone: phone || null,
          password_hash: hashedPassword,
          ...(prefObj ? { preferences: prefObj } : {})
        }
      });
    }

    await assignUserRole(targetUser.id, userRole);
    await syncEmailAliasToMailDb(email, cleanAlias, password);
    return { email, alias: cleanAlias };
  }

  async updateMailAccount(id, { username, password, role, full_name, ktp, address, phone }, requestingUser) {
    let conn;
    try {
      conn = await mysql.createConnection(mailDbConfig);
      const [rows] = await conn.execute('SELECT full_email, alias FROM email_aliases WHERE id = ?', [id]);
      if (!rows.length) throw new Error('Email tidak ditemukan.');

      const currentEmail = rows[0].full_email;
      const rawAlias = username ? username.trim() : rows[0].alias;
      const cleanAlias = rawAlias.replace(/@topclassuniversal\.co\.id$/i, '').trim();
      const newEmail = `${cleanAlias}@topclassuniversal.co.id`;

      const existingUser = await prisma.user.findFirst({
        where: { email: currentEmail },
        include: { userRoles: { include: { role: true } } }
      });

      if (existingUser) {
        const primaryRole = (existingUser.userRoles && existingUser.userRoles.length > 0 && existingUser.userRoles[0].role) ? existingUser.userRoles[0].role.name : (existingUser.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
        checkSuperAdminAccess({ ...existingUser, role: primaryRole }, requestingUser, 'merubah akun');
      }

      if (role === 'SUPERADMIN' && !isSuperAdminUser(requestingUser)) {
        throw new Error('Hanya Super Admin yang dapat menetapkan role SUPERADMIN.');
      }

      const updateData = {
        full_name: full_name !== undefined ? full_name : undefined,
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined,
        preferences: ktp ? { ktp } : undefined
      };

      if (password && password.length >= 6) {
        updateData.password_hash = await bcrypt.hash(password, 10);
      }
      if (cleanAlias !== rows[0].alias) {
        updateData.username = cleanAlias;
        updateData.email = newEmail;
      }

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData
        });
        if (role) {
          await assignUserRole(existingUser.id, role);
        }
      }

      let passHash = null;
      if (password && password.length >= 6) {
        passHash = md5CryptDovecot(password);
      }

      if (passHash) {
        await conn.execute(
          'UPDATE email_aliases SET alias = ?, full_email = ?, password_hash = ? WHERE id = ?',
          [cleanAlias, newEmail, passHash, id]
        );
      } else {
        await conn.execute(
          'UPDATE email_aliases SET alias = ?, full_email = ? WHERE id = ?',
          [cleanAlias, newEmail, id]
        );
      }

      return { email: newEmail, alias: cleanAlias };
    } finally {
      if (conn) await conn.end();
    }
  }

  async updateMailPassword(id, password, requestingUser) {
    if (!password || password.length < 6) throw new Error('Password minimal 6 karakter.');
    let conn;
    try {
      conn = await mysql.createConnection(mailDbConfig);
      const [rows] = await conn.execute('SELECT full_email FROM email_aliases WHERE id = ?', [id]);
      if (!rows.length) throw new Error('Email tidak ditemukan.');

      const existingUser = await prisma.user.findFirst({
        where: { email: rows[0].full_email },
        include: { userRoles: { include: { role: true } } }
      });
      if (existingUser) {
        const primaryRole = (existingUser.userRoles && existingUser.userRoles.length > 0 && existingUser.userRoles[0].role) ? existingUser.userRoles[0].role.name : (existingUser.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
        checkSuperAdminAccess({ ...existingUser, role: primaryRole }, requestingUser, 'merubah password');
      }

      const password_hash = md5CryptDovecot(password);
      await conn.execute('UPDATE email_aliases SET password_hash = ? WHERE id = ?', [password_hash, id]);

      if (existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { id: existingUser.id }, data: { password_hash: hashedPassword } });
      }

      return rows[0].full_email;
    } finally {
      if (conn) await conn.end();
    }
  }

  async deleteMailAccount(id, requestingUser) {
    let conn;
    try {
      conn = await mysql.createConnection(mailDbConfig);
      const [rows] = await conn.execute('SELECT full_email FROM email_aliases WHERE id = ?', [id]);
      if (!rows.length) throw new Error('Email tidak ditemukan.');

      const email = rows[0].full_email;
      const existingUser = await prisma.user.findFirst({
        where: { email },
        include: { userRoles: { include: { role: true } } }
      });
      if (existingUser) {
        const primaryRole = (existingUser.userRoles && existingUser.userRoles.length > 0 && existingUser.userRoles[0].role) ? existingUser.userRoles[0].role.name : (existingUser.email === 'ceo@topclassuniversal.co.id' ? 'SUPERADMIN' : 'ADMIN');
        checkSuperAdminAccess({ ...existingUser, role: primaryRole }, requestingUser, 'menghapus akun');
      }

      await conn.execute('DELETE FROM email_aliases WHERE id = ?', [id]);

      if (existingUser) {
        await prisma.user.delete({ where: { id: existingUser.id } }).catch(() => null);
      }

      return email;
    } finally {
      if (conn) await conn.end();
    }
  }
}

module.exports = new AdminService();
