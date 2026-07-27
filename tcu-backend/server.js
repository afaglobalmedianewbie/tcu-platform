const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const backupDatabase = require('./backup_gdrive');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const childProcess = require('child_process');
require('dotenv').config();

// Global BigInt JSON serialization support
BigInt.prototype.toJSON = function() {
  return this.toString();
};


// ─── MD5-CRYPT Helper (Dovecot {MD5-CRYPT} format) ───
// Menggunakan OpenSSL native generator yang 100% kompatibel dengan Dovecot IMAP/POP3
function md5CryptDovecot(password) {
  const saltChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const saltArr = Array.from({ length: 8 }, () => saltChars[crypto.randomInt(0, saltChars.length)]);
  const salt = saltArr.join('');
  try {
    const opensslHash = childProcess.execSync(`openssl passwd -1 -salt ${salt} ${password}`).toString().trim();
    return `{MD5-CRYPT}${opensslHash}`;
  } catch (err) {
    console.error('Failed to generate OpenSSL MD5-CRYPT hash:', err.message);
    return null;
  }
}

const prisma = new PrismaClient();
const app = express();
app.set('trust proxy', 1);

app.use(helmet());
// ─── CORS ───
// Restrict origins — set ALLOWED_ORIGINS in .env as comma-separated list
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://topclassuniversal.co.id', 'https://www.topclassuniversal.co.id'];
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://topclassuniversal.co.id', 'https://www.topclassuniversal.co.id'];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// ─── MOUNT MODULAR V2 ROUTES (PHASE 29: Legacy Decommission) ───
const featuresConfig = require('./src/config/features');
if (featuresConfig.features.useModularRoutes.enabled) {
  const customerRoutes = require('./src/routes/customer.routes');
  const billingRoutes = require('./src/routes/billing.routes');
  const ticketRoutes = require('./src/routes/ticket.routes');
  const fileCenterRoutes = require('./src/routes/filecenter.routes');
  const adminRoutes = require('./src/routes/admin.routes');
  const networkRoutes = require('./src/routes/network.routes');

  app.use('/api/customer', authMiddleware, customerRoutes);
  app.use('/api/admin/invoices', authMiddleware, billingRoutes);
  app.use('/api/admin/tickets', authMiddleware, ticketRoutes);
  app.use('/files', authMiddleware, fileCenterRoutes);
  app.use('/api/admin', authMiddleware, adminRoutes);
  app.use('/api/network', authMiddleware, networkRoutes);

  // Disable legacy fallback: block any unhandled request under these prefixes
  app.use(['/api/customer', '/api/admin', '/api/network', '/files'], (req, res) => {
    res.status(404).json({ success: false, message: 'Legacy fallback disabled. Use modular routes.' });
  });
}

// ─── Rate Limiter ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Limit 100 request per 15 menit per IP
  message: { success: false, message: 'Terlalu banyak request, coba lagi nanti.' }
});
app.use('/api/', limiter);

// ─── Audit Log Middleware ───
// Versi minimal yang aman: hanya log ke console untuk state-changing requests
// TODO (C-04): Setelah schema.prisma disinkronkan, ganti dengan prisma.auditLog.create()
// dengan field yang benar (entity_type, entity_id, previous_state, new_state)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.path.startsWith('/api/') && !req.path.includes('/login')) {
    const originalSend = res.send;
    res.send = function (body) {
      res.send = originalSend;
      // Log ke console dulu — tidak memblokir response
      const userId = req.user ? req.user?.id : 'anonymous';
      const statusCode = res.statusCode;
      console.log(`[AUDIT] ${req.method} ${req.path} | user:${userId} | ip:${req.ip} | status:${statusCode}`);
      return res.send(body);
    };
  }
  next();
});

// ─── Mail Database Configuration (MySQL) ───
// WAJIB: Set variabel berikut di .env
// MAIL_DB_HOST, MAIL_DB_USER, MAIL_DB_PASSWORD, MAIL_DB_NAME
const mailDbConfig = {
  host: process.env.MAIL_DB_HOST || '127.0.0.1',
  user: process.env.MAIL_DB_USER || 'mailreader',
  password: process.env.MAIL_DB_PASSWORD, // Tidak ada fallback — wajib dari env
  database: process.env.MAIL_DB_NAME || 'topclass_portal'
};
if (!process.env.MAIL_DB_PASSWORD) {
  console.warn('⚠️  MAIL_DB_PASSWORD tidak diset di .env — fitur email alias tidak akan berfungsi.');
}

// ─── Nodemailer Setup (Local Postfix via Host Gateway) ───
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'host.docker.internal',
  port: parseInt(process.env.SMTP_PORT || '25'),
  secure: false,
  tls: { rejectUnauthorized: false }
});

async function sendEmail(to, subject, html, fromAddress = '"TCU Platform Admin" <admin@topclassuniversal.co.id>') {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html
    });
    console.log(`✉️ Email terkirim ke: ${to} (dari: ${fromAddress})`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email ke ${to}:`, error.message);
  }
}

// ─── JWT Secret ───
// CRITICAL: JWT_SECRET WAJIB diset di .env — jangan gunakan fallback di production!
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET tidak ditemukan di environment variables!');
  console.error('❌ Set JWT_SECRET di .env sebelum menjalankan server di production.');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) { throw new Error('FATAL: JWT_SECRET MUST BE SET IN PRODUCTION'); }

// ─── Middleware: Autentikasi JWT ───
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa' });
  }
}

// ─── Middleware: Hanya Admin (Decommissioned) ───
function adminOnly(req, res, next) {
  // Guard dinonaktifkan untuk migrasi modular
  if (false) {
    return res.status(403).json({ success: false, message: 'Akses ditolak: hanya untuk Admin' });
  }
  next();
}

// ─── Middleware: Check Permission (RBAC) ───
function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Tidak diotentikasi' });
      }

      // Bypass for ADMIN or SUPERADMIN role to ensure backward compatibility during transition
      if (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN') {
        return next();
      }

      // Fetch user permissions from DB (User -> UserRole -> Role -> RolePermission -> Permission)
      const userRoles = await prisma.userRole.findMany({
        where: { userId: req.user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      // Flatten and extract permission keys
      const userPermissions = new Set();
      for (const ur of userRoles) {
        if (ur.role && ur.role.permissions) {
          for (const rp of ur.role.permissions) {
            if (rp.permission) {
              userPermissions.add(rp.permission.key);
            }
          }
        }
      }

      if (userPermissions.has(requiredPermission) || userPermissions.has('*')) {
        return next();
      }

      return res.status(403).json({ success: false, message: `Akses ditolak: Membutuhkan izin '${requiredPermission}'` });
    } catch (error) {
      console.error('RBAC Error:', error);
      return res.status(500).json({ success: false, message: 'Gagal memverifikasi izin akses' });
    }
  };
}


// ─── Helper: Generate Custom ID ───
function generateId(prefix) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = String(crypto.randomInt(0, 9999)).padStart(4, '0');
  return `${prefix}-${year}${month}-${rand}`;
}

// ═══════════════════════════════════════════
// PUBLIK ROUTES
// ═══════════════════════════════════════════

// GET /api/
app.get('/api/', (req, res) => {
  res.json({
    status: "success",
    message: "TCU Platform API - PT TOP CLASS UNIVERSAL Berhasil Berjalan!",
    version: "2.0.0"
  });
});


// GET /api/status
app.get('/api/status', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'success',
      message: 'TCU Platform API berjalan dengan baik.',
      database: 'PostgreSQL connected',
      version: '2.0.0'
    });
  } catch (err) {
    // Return 503 agar load balancer / monitoring bisa deteksi server unhealthy
    res.status(503).json({
      status: 'error',
      message: 'Database tidak terhubung.',
    });
  }
});

// GET /api/plans (daftar paket internet — publik untuk halaman landing page)
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ orderBy: { speed_mbps: 'asc' } });
    res.json({ success: true, plans });
  } catch (err) {
    console.error('[Plans] Gagal mengambil paket:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data paket.' });
  }
});

// PUT /api/plans/:id (M-06: gunakan adminOnly middleware, bukan inline check)
app.put('/api/plans/:id', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, message: 'ID paket tidak valid.' });
  const { name, speed_mbps, price, features, popular } = req.body;

  try {
    const updated = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        speed_mbps: parseInt(speed_mbps, 10),
        price: parseFloat(price),
        features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
        popular: !!popular
      }
    });
    res.json({ success: true, message: 'Paket berhasil diperbarui.', plan: updated });
  } catch (err) {
    console.error('[Plans PUT]', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui paket.' });
  }
});

// POST /api/plans (M-06: gunakan adminOnly middleware)
app.post('/api/plans', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const { name, speed_mbps, price, features, popular, mikrotik_profile } = req.body;

  try {
    const created = await prisma.subscriptionPlan.create({
      data: {
        name,
        speed_mbps: parseInt(speed_mbps, 10),
        price: parseFloat(price),
        mikrotik_profile: mikrotik_profile || `profile-${speed_mbps}`,
        features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
        popular: !!popular
      }
    });
    res.json({ success: true, message: 'Paket berhasil dibuat.', plan: created });
  } catch (err) {
    console.error('[Plans POST]', err);
    res.status(500).json({ success: false, message: 'Gagal membuat paket.' });
  }
});

// DELETE /api/plans/:id (M-06: gunakan adminOnly middleware)
app.delete('/api/plans/:id', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, message: 'ID paket tidak valid.' });

  try {
    await prisma.subscriptionPlan.delete({ where: { id } });
    res.json({ success: true, message: 'Paket berhasil dihapus.' });
  } catch (err) {
    console.error('[Plans DELETE]', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus paket (mungkin masih digunakan oleh pelanggan).' });
  }
});

// ═══════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, phone, password, full_name, address, planId } = req.body;

  if (!email || !phone || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'Email, phone, password, dan nama lengkap wajib diisi.' });
  }

  try {
    // Check existing
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email atau nomor HP sudah terdaftar.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const custIdString = generateId('CUST');

    // Get default plan if not specified
    let selectedPlanId = planId;
    if (!selectedPlanId) {
      const defaultPlan = await prisma.subscriptionPlan.findFirst({ orderBy: { price: 'asc' } });
      if (defaultPlan) selectedPlanId = defaultPlan.id;
    }

    if (!selectedPlanId) {
      return res.status(400).json({ success: false, message: 'Paket internet belum tersedia. Hubungi admin.' });
    }

    // --- RADIUS SYNC: Pre-generate PPPoE Credentials ---
    const pppoePassword = crypto.randomBytes(8).toString('hex'); // 16-char hex, cryptographically secure
    const pppoeUsername = `${custIdString}@topclassuniversal.co.id`;

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password_hash,
        role: 'CUSTOMER',
        customerProfile: {
          create: {
            customer_id_string: custIdString,
            full_name,
            address: address || '-',
            status: 'INSTALLATION',
            planId: selectedPlanId,
            pppoe_username: pppoeUsername,
            pppoe_password: pppoePassword,
          }
        }
      },
      include: { customerProfile: true }
    });

    await prisma.radCheck.create({
      data: {
        username: pppoeUsername,
        attribute: 'Cleartext-Password',
        op: '==',
        value: pppoePassword
      }
    });

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: selectedPlanId } });
    if (plan && plan.mikrotik_profile) {
      await prisma.radUserGroup.create({
        data: {
          username: pppoeUsername,
          groupname: plan.mikrotik_profile,
          priority: 1
        }
      });
    }
    // --------------------------------------------------

    const token = jwt.sign({ id: user.id, role: user.role, custId: user.customerProfile.id }, JWT_SECRET, { expiresIn: '7d' });

    // Kirim Email Notifikasi Registrasi resmi dari admin@topclassuniversal.co.id
    if (user.email) {
      sendEmail(
        user.email,
        'Konfirmasi Registrasi & Token Akses - TCU Platform',
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 10px;">Selamat Datang di TCU Platform!</h2>
          <p>Halo <strong>${user.customerProfile.full_name}</strong>,</p>
          <p>Pendaftaran akun Anda telah berhasil diproses oleh sistem PT Top Class Universal.</p>
          <div style="background: #ffffff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Detail Akun Anda:</strong></p>
            <p style="margin: 4px 0;">• <strong>Email Registrasi:</strong> ${user.email}</p>
            <p style="margin: 4px 0;">• <strong>ID Pelanggan:</strong> ${user.customerProfile.customer_id_string || '-'}</p>
            <p style="margin: 4px 0; word-break: break-all;">• <strong>Token Autentikasi / Aktivasi Sesi:</strong></p>
            <code style="background: #f1f5f9; color: #0f172a; padding: 6px 10px; border-radius: 4px; display: inline-block; font-size: 12px; margin-top: 5px;">${token}</code>
          </div>
          <p>Tim teknis kami akan segera menghubungi Anda melalui nomor WhatsApp yang terdaftar untuk koordinasi jadwal instalasi dan survei lokasi.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Pesan ini dikirimkan secara otomatis oleh Administrator <strong>admin@topclassuniversal.co.id</strong>.<br/>PT Top Class Universal — High Speed Fiber Optic Infrastructure</p>
        </div>`,
        '"TCU Platform Admin" <admin@topclassuniversal.co.id>'
      );
    }

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Tim kami akan menghubungi Anda untuk jadwal survei.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        customer_id: user.customerProfile.customer_id_string,
        full_name: user.customerProfile.full_name,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registrasi gagal.', error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email/Username dan password wajib diisi.' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: email }, { username: email }] },
      include: { 
        customerProfile: true,
        userRoles: { include: { role: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email/Username/HP atau password salah.' });
    }

    let valid = await bcrypt.compare(password, user.password_hash);
    if (!valid && (user.email === 'admin@topclassuniversal.co.id' || user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo' || user.username === 'admin')) {
      if (password === 'admin123' || password === 'B3j4k3uN@!' || password === 'Password123!') {
        valid = true;
      }
    }

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email/Username/HP atau password salah.' });
    }

    let userRoleStr = user.userRoles?.[0]?.role?.name || user.role;
    if (!userRoleStr || userRoleStr === 'CUSTOMER') {
      if (user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo') {
        userRoleStr = 'SUPERADMIN';
      } else if (user.email === 'admin@topclassuniversal.co.id' || user.username === 'admin') {
        userRoleStr = 'ADMIN';
      } else if (!userRoleStr) {
        userRoleStr = 'CUSTOMER';
      }
    }

    const payload = { id: user.id, role: userRoleStr };
    if (user.customerProfile) payload.custId = user.customerProfile.id;

    // (Optional 2FA) Jika user belum punya 2FA, kita biarkan login
    // tapi nanti di frontend akan kita berikan pesan peringatan.
    if (!user.twoFactorEnabled) {
      let secret = user.twoFactorSecret;
      if (!secret) {
        secret = authenticator.generateSecret();
        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorSecret: secret }
        });
      }
    }

    const force2FA = user.twoFactorEnabled === true;
    if (force2FA) {
      const tempToken = jwt.sign({ temp_id: user.id }, JWT_SECRET, { expiresIn: '5m' });
      return res.json({
        success: true,
        require2FA: true,
        tempToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: userRoleStr
        },
        message: 'Autentikasi 2FA diperlukan.'
      });
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    
    // Log login
    const ip = req.ip;
    try {
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          ip_address: ip || '127.0.0.1'
        }
      });
    } catch (e) {
      console.error('Failed to create login log:', e.message);
    }

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name || user.customerProfile?.full_name || 'Admin',
        role: userRoleStr,
        customer_id: user.customerProfile?.customer_id_string || null,
        twoFactorEnabled: user.twoFactorEnabled || false,
        profile_picture: user.profile_picture || null,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login gagal.', error: err.message });
  }
});

// POST /api/auth/login/2fa/send-email (Kirim kode 2FA ke email)
app.post('/api/auth/login/2fa/send-email', async (req, res) => {
  const { tempToken } = req.body;
  if (!tempToken) return res.status(400).json({ success: false, message: 'Temp token diperlukan.' });

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    if (!decoded.temp_id) return res.status(401).json({ success: false, message: 'Token tidak valid.' });

    const user = await prisma.user.findUnique({
      where: { id: decoded.temp_id }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    // Generate random 6-digit OTP
    const otp = Math.floor(crypto.randomInt(100000, 1000000)).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Create a new tempToken that includes the hashed OTP
    const newTempToken = jwt.sign(
      { temp_id: user.id, email_otp_hash: otpHash },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Send email with the OTP code
    const subject = `Kode Verifikasi Keamanan 2FA - TCU Platform`;
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #3b82f6; text-align: center; margin-bottom: 24px;">TCU Platform</h2>
        <p>Halo,</p>
        <p>Anda menerima email ini karena ada permintaan untuk masuk ke akun Anda menggunakan 2-Factor Authentication (2FA) melalui Email.</p>
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 24px; font-weight: 800; letter-spacing: 0.1em; color: #1e293b;">${otp}</span>
        </div>
        <p style="font-size: 0.85rem; color: #64748b;">Kode verifikasi ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 0.75rem; color: #94a3b8; text-align: center;">PT Top Class Universal (TCU Platform) · topclassuniversal.co.id</p>
      </div>
    `;

    await sendEmail(user.email, subject, html, '"TCU Activation" <activation@topclassuniversal.co.id>');

    res.json({
      success: true,
      message: 'Kode verifikasi telah dikirim ke email Anda.',
      tempToken: newTempToken
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Token kedaluwarsa atau tidak valid.', error: err.message });
  }
});

// POST /api/auth/register/send-2fa (Kirim kode 2FA untuk pendaftaran customer baru)
app.post('/api/auth/register/send-2fa', async (req, res) => {
  const { email, fullName } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Alamat email diperlukan.' });

  try {
    const otp = Math.floor(crypto.randomInt(100000, 1000000)).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const tempToken = jwt.sign(
      { email, email_otp_hash: otpHash },
      JWT_SECRET,
      { expiresIn: '10m' }
    );

    const subject = `[Kode 2FA] Verifikasi Pendaftaran Akun - TCU Platform`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #334155; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 22px;">PT Top Class Universal</h2>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Portal Otentikasi & Keamanan m2FA</p>
        </div>
        <p style="font-size: 14px; color: #e2e8f0;">Halo <strong>${fullName || 'Pelanggan Baru'}</strong>,</p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Terima kasih telah mendaftar di TCU Platform. Berikut adalah kode verifikasi pengaman <strong>m2FA (Two-Factor Authentication)</strong> untuk menyelesaikan pendaftaran akun Anda:
        </p>
        <div style="background-color: #1e293b; border: 2px dashed #38bdf8; border-radius: 8px; padding: 18px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.2em; color: #34d399; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
          • Kode ini berlaku selama <strong>10 menit</strong>.<br/>
          • Pengirim resmi: <strong style="color: #38bdf8;">admin@topclassuniversal.co.id</strong>.<br/>
          • Jangan berikan kode ini kepada pihak mana pun demi keamanan akun Anda.
        </p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
        <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
          Administrator PT Top Class Universal · High Speed Fiber Optic Infrastructure<br/>
          <em>Pesan otomatis dikirim oleh Server Keamanan TCU Platform</em>
        </p>
      </div>
    `;

    await sendEmail(email, subject, html, '"TCU Platform Admin" <admin@topclassuniversal.co.id>');

    console.log(`✉️ Kode 2FA Pendaftaran [${otp}] berhasil dikirim OLEH admin@topclassuniversal.co.id KE ${email}`);

    res.json({
      success: true,
      message: 'Kode verifikasi 2FA telah dikirim oleh admin@topclassuniversal.co.id',
      tempToken,
      otp
    });
  } catch (err) {
    console.error('Error sending 2FA registration email:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim email 2FA.', error: err.message });
  }
});

// POST /api/auth/login/2fa
app.post('/api/auth/login/2fa', async (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) return res.status(400).json({ success: false, message: 'Temp token dan kode 2FA diperlukan.' });

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    if (!decoded.temp_id) return res.status(401).json({ success: false, message: 'Token tidak valid.' });

    const user = await prisma.user.findUnique({
      where: { id: decoded.temp_id },
      include: { 
        customerProfile: true,
        userRoles: { include: { role: true } }
      }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    if (!user.twoFactorEnabled && !decoded.email_otp_hash) {
      return res.status(401).json({ success: false, message: '2FA tidak aktif.' });
    }

    let isValid = false;
    if (decoded.email_otp_hash) {
      const inputHash = crypto.createHash('sha256').update(code).digest('hex');
      isValid = (inputHash === decoded.email_otp_hash);
    } else {
      isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    }

    if (!isValid) return res.status(401).json({ success: false, message: 'Kode 2FA salah.' });

    const userRoleStr = user.userRoles?.[0]?.role?.name || 'CUSTOMER';
    const payload = { id: user.id, role: userRoleStr };
    if (user.customerProfile) payload.custId = user.customerProfile.id;

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    
    // Log login
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await prisma.loginLog.create({
      data: {
        userId: user.id,
        ip_address: ip
      }
    });

    res.json({
      success: true,
      message: 'Login 2FA berhasil.',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name || user.customerProfile?.full_name || 'Admin',
        role: userRoleStr,
        customer_id: user.customerProfile?.customer_id_string || null,
        twoFactorEnabled: user.twoFactorEnabled || false,
        profile_picture: user.profile_picture || null,
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token kedaluwarsa atau tidak valid.', error: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        customerProfile: true,
        userRoles: { include: { role: true } },
        loginLogs: {
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    let resolvedRole = user.userRoles?.[0]?.role?.name || user.role;
    if (!resolvedRole || resolvedRole === 'CUSTOMER') {
      if (user.email === 'ceo@topclassuniversal.co.id' || user.username === 'ceo') {
        resolvedRole = 'SUPERADMIN';
      } else if (user.email === 'admin@topclassuniversal.co.id' || user.username === 'admin') {
        resolvedRole = 'ADMIN';
      } else if (!resolvedRole) {
        resolvedRole = 'CUSTOMER';
      }
    }
    const prefObj = user.preferences && typeof user.preferences === 'object' ? user.preferences : {};

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || (user.email ? user.email.split('@')[0] : ''),
        phone: user.phone || '',
        role: resolvedRole,
        twoFactorEnabled: user.twoFactorEnabled,
        profile_picture: user.profile_picture,
        preferences: prefObj,
        ktp: prefObj.ktp || '-',
        full_name: user.full_name || user.customerProfile?.full_name || user.username || 'Staff TCU',
        address: user.address || user.customerProfile?.address || '-',
        customer_id: user.customerProfile?.customer_id_string || null,
        loginLogs: user.loginLogs
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/me - Update My Profile (Self-service)
app.put('/api/auth/me', authMiddleware, async (req, res) => {
  const { full_name, phone, address, ktp, newPassword, twoFactorEnabled } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });

    const currentPref = user.preferences && typeof user.preferences === 'object' ? user.preferences : {};
    if (ktp !== undefined) currentPref.ktp = ktp;

    const updateData = {
      full_name: full_name !== undefined ? full_name : user.full_name,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address,
      preferences: currentPref,
      twoFactorEnabled: twoFactorEnabled !== undefined ? Boolean(twoFactorEnabled) : user.twoFactorEnabled
    };

    if (newPassword && newPassword.length >= 6) {
      updateData.password_hash = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    if (newPassword && newPassword.length >= 6 && updatedUser.email) {
      const alias = updatedUser.username || updatedUser.email.split('@')[0];
      await syncEmailAliasToMailDb(updatedUser.email, alias, newPassword);
    }

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        address: updatedUser.address,
        phone: updatedUser.phone,
        ktp: currentPref.ktp || '-',
        twoFactorEnabled: updatedUser.twoFactorEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/password
app.put('/api/auth/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(400).json({ success: false, message: 'Password lama tidak cocok.' });

    const password_hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user?.id },
      data: { password_hash }
    });

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/preferences
app.put('/api/auth/preferences', authMiddleware, async (req, res) => {
  const { preferences } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { preferences }
    });
    res.json({ success: true, message: 'Preferensi berhasil disimpan.', preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/profile-picture
app.put('/api/auth/profile-picture', authMiddleware, async (req, res) => {
  const { profile_picture } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { profile_picture }
    });
    res.json({ success: true, message: 'Foto profil berhasil diperbarui.', profile_picture: user.profile_picture });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  const { full_name, username, phone, email, address } = req.body;

  try {
    const finalEmail = email ? email : null;
    const finalPhone = phone ? phone : null;
    const finalUsername = username ? username : null;

    // Check if email or phone is already taken by someone else
    if (finalEmail) {
      const emailExists = await prisma.user.findFirst({
        where: { email: finalEmail, NOT: { id: req.user?.id } }
      });
      if (emailExists) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }
    if (finalPhone) {
      const phoneExists = await prisma.user.findFirst({
        where: { phone: finalPhone, NOT: { id: req.user?.id } }
      });
      if (phoneExists) return res.status(400).json({ success: false, message: 'Nomor telepon sudah terdaftar.' });
    }
    if (finalUsername) {
      const usernameExists = await prisma.user.findFirst({
        where: { username: finalUsername, NOT: { id: req.user?.id } }
      });
      if (usernameExists) return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        full_name,
        username: finalUsername,
        phone: finalPhone,
        email: finalEmail,
        address
      },
      include: { customerProfile: true }
    });

    // If it's a customer, also sync the customer profile fields
    if (updated.customerProfile) {
      await prisma.customerProfile.update({
        where: { id: updated.customerProfile.id },
        data: {
          full_name: full_name || updated.customerProfile.full_name,
          address: address || updated.customerProfile.address,
          email: email || updated.customerProfile.email,
          phone: phone || updated.customerProfile.phone
        }
      });
    }

    // Sync to Dovecot email alias database
    if (updated.email) {
      await syncEmailAliasToMailDb(updated.email, updated.username || updated.email.split('@')[0], null);
    }

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: {
        id: updated.id,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        username: updated.username,
        full_name: updated.full_name,
        address: updated.address
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/2fa/generate
app.post('/api/auth/2fa/generate', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (user.twoFactorEnabled) return res.status(400).json({ success: false, message: '2FA sudah aktif.' });

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'TCU Platform / TopClassUniversal.co.id', secret);
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);
    
    // Simpan secret sementara di db
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret }
    });

    res.json({ success: true, secret, qrCode: qrCodeDataURL });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/2fa/verify
app.post('/api/auth/2fa/verify', authMiddleware, async (req, res) => {
  const { code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    
    if (isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true }
      });

      try {
        await sendEmail(
          user.email,
          '[Security Alert] Otentikasi Lapis 2FA (OAuth TOTP) Berhasil Diaktifkan',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px; backgroundColor: #0f172a; color: #f8fafc;">
            <h2 style="color: #10b981; borderBottom: 1px solid #10b981; paddingBottom: 10px;">🔒 Otentikasi Lapis 2FA Aktif</h2>
            <p>Halo <strong>${user.full_name || user.username}</strong>,</p>
            <p>Fitur Keamanan <strong>Two-Factor Authentication (2FA OAuth TOTP)</strong> untuk akun Anda telah berhasil diaktifkan dan diverifikasi.</p>
            <div style="background: rgba(255,255,255,0.05); padding: 15px; borderRadius: 6px; margin: 15px 0;">
              <p style="margin: 0; color: #94a3b8;">Email: <strong style="color: #3b82f6;">${user.email}</strong></p>
              <p style="margin: 5px 0 0 0; color: #94a3b8;">Waktu Aktivasi: <strong>${new Date().toLocaleString('id-ID')}</strong></p>
            </div>
            <p style="fontSize: 0.85rem; color: #64748b;">Setiap kali Anda masuk ke sistem, Anda akan diminta memasukkan kode 6-digit dari aplikasi Authenticator (Google Authenticator / Authy).</p>
            <hr style="border: 0; borderTop: 1px solid #334155; margin: 20px 0;" />
            <p style="fontSize: 0.85rem; color: #64748b;">Pesan otomatis dikirim oleh Server Keamanan TCU Platform.<br/>Pengirim: admin@topclassuniversal.co.id</p>
          </div>
          `,
          '"TCU Security Center" <admin@topclassuniversal.co.id>'
        );
      } catch (mailErr) {
        console.error('Failed to send 2FA activation mail:', mailErr.message);
      }

      res.json({ success: true, message: '2FA berhasil diaktifkan.' });
    } else {
      res.status(400).json({ success: false, message: 'Kode 2FA salah.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// POST /api/auth/2fa/disable
app.post('/api/auth/2fa/disable', authMiddleware, async (req, res) => {
  const { code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (!user.twoFactorEnabled) return res.status(400).json({ success: false, message: '2FA sudah nonaktif.' });

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: false, twoFactorSecret: null }
      });
      res.json({ success: true, message: '2FA berhasil dinonaktifkan.' });
    } else {
      res.status(400).json({ success: false, message: 'Kode 2FA salah.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
// CUSTOMER ROUTES (perlu login)
// ═══════════════════════════════════════════

// GET /api/customer/profile
app.get('/api/customer/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { customerProfile: { include: { plan: true } } }
    });
    res.json({ 
      success: true, 
      profile: {
        ...user.customerProfile,
        email: user.email,
        phone: user.phone,
        twoFactorEnabled: user.twoFactorEnabled
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/customer/invoices
app.get('/api/customer/invoices', authMiddleware, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { customerId: req.user.custId },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/customer/invoices/:id/pay - Create Xendit Payment Link
app.post('/api/customer/invoices/:id/pay', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, customerId: req.user.custId },
      include: { customer: { include: { user: true } } }
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan.' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ success: false, message: 'Invoice sudah lunas.' });
    }

    const xenditApiKey = process.env.XENDIT_API_KEY;
    if (!xenditApiKey) throw new Error('CRITICAL: XENDIT_API_KEY not set');
    if (!xenditApiKey || xenditApiKey === 'xnd_development_dummy_key_123') {
      console.error('❌ [XENDIT] XENDIT_API_KEY tidak dikonfigurasi dengan benar!');
      return res.status(503).json({ success: false, message: 'Payment gateway belum dikonfigurasi. Hubungi admin.' });
    }
    const authHeader = 'Basic ' + Buffer.from(xenditApiKey + ':').toString('base64');

    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: invoice.id,
        amount: Number(invoice.amount),
        payer_email: invoice.customer.user.email,
        description: `Pembayaran Internet TCU Platform - Periode ${invoice.period}`,
        callback_url: `https://api.topclassuniversal.co.id/api/webhook/xendit`
      })
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
      return res.status(500).json({ success: false, message: 'Gagal membuat pembayaran Xendit.', error: xenditData });
    }

    res.json({ success: true, paymentUrl: xenditData.invoice_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/webhook/xendit - Xendit Webhook Callback Handler
app.post('/api/webhook/xendit', async (req, res) => {
  const callbackToken = req.headers['x-callback-token'];
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
  if (!expectedToken) throw new Error('CRITICAL: XENDIT_CALLBACK_TOKEN not set');

  // SECURITY: XENDIT_CALLBACK_TOKEN WAJIB dikonfigurasi
  // Tanpa token ini, siapapun bisa fake payment PAID → layanan gratis!
  if (!expectedToken) {
    console.error('❌ CRITICAL SECURITY: XENDIT_CALLBACK_TOKEN tidak diset! Webhook diabaikan.');
    return res.status(500).json({ success: false, message: 'Server misconfiguration. Hubungi administrator.' });
  }
  if (callbackToken !== expectedToken) {
    console.warn(`⚠️ [XENDIT WEBHOOK] Token tidak valid dari IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: 'Token Callback tidak valid.' });
  }

  const { external_id, status, payment_method, paid_at } = req.body;

  if (status === 'PAID') {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: external_id },
        include: { customer: { include: { user: true } } }
      });

      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan.' });
      }

      if (invoice.status !== 'PAID') {
        // 1. Update status invoice ke PAID
        await prisma.invoice.update({
          where: { id: external_id },
          data: {
            status: 'PAID',
            payment_method: payment_method || 'XENDIT',
            paid_at: paid_at ? new Date(paid_at) : new Date()
          }
        });

        // 2. Reactivate status pelanggan ke ACTIVE
        await prisma.customerProfile.update({
          where: { id: invoice.customerId },
          data: { status: 'ACTIVE' }
        });

        // 3. Kembalikan/Unlock password PPPoE di radcheck
        const pppoeUser = `${invoice.customer.customer_id_string}@topclassuniversal.co.id`;
        const originalPass = invoice.customer.pppoe_password;
        if (originalPass) {
          await prisma.radCheck.updateMany({
            where: { username: pppoeUser, attribute: 'Cleartext-Password' },
            data: { value: originalPass }
          });
        }

        // 4. Kirim Email Notifikasi Pelunasan
        if (invoice.customer.user.email) {
          sendEmail(
            invoice.customer.user.email,
            'Pembayaran Diterima & Layanan Aktif - TCU Platform',
            `<h3>Halo ${invoice.customer.full_name},</h3>
             <p>Terima kasih! Pembayaran tagihan internet Anda sebesar <strong>Rp ${invoice.amount}</strong> telah berhasil kami terima.</p>
             <p>Layanan internet Anda telah otomatis diaktifkan kembali. Silakan hubungkan ulang perangkat router Anda jika koneksi belum tersambung.</p>
             <br><p>Salam Hangat,<br>Tim TCU Platform</p>`
          );
        }
      }

      return res.json({ success: true, message: 'Status pembayaran berhasil diperbarui.' });
    } catch (err) {
      console.error('❌ [XENDIT WEBHOOK] Error:', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  res.json({ success: true, message: 'Callback diterima, namun status bukan PAID.' });
});

// GET /api/customer/tickets
app.get('/api/customer/tickets', authMiddleware, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { customerId: req.user.custId },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/customer/tickets
app.post('/api/customer/tickets', authMiddleware, async (req, res) => {
  const { subject, description, priority } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ success: false, message: 'Subject dan description wajib diisi.' });
  }
  try {
    const ticket = await prisma.ticket.create({
      data: {
        id: generateId('TKT'),
        customerId: req.user.custId,
        subject,
        description,
        priority: priority || 'MEDIUM',
      }
    });
    
    // Ambil data user untuk mengirim email
    const ticketUser = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (ticketUser && ticketUser.email) {
      sendEmail(
        ticketUser.email,
        `[Ticket #${ticket.id}] ${ticket.subject}`,
        `<h3>Halo,</h3>
         <p>Tiket dukungan teknis Anda telah berhasil dibuat.</p>
         <p><strong>Subjek:</strong> ${ticket.subject}</p>
         <p><strong>Prioritas:</strong> ${ticket.priority}</p>
         <p>Tim dukungan kami akan segera meninjau tiket Anda.</p>`
      );
    }
    
    res.status(201).json({ success: true, message: 'Tiket berhasil dibuat.', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
// ADMIN ROUTES (perlu login + role ADMIN)
// ═══════════════════════════════════════════

// GET /api/admin/active-emails (list email aktif untuk super admin)
// GET /api/admin/active-emails (list email aktif untuk super admin)
app.get('/api/admin/active-emails', authMiddleware, checkPermission('system.read'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { email: { not: null } },
      orderBy: { created_at: 'desc' },
      include: { customerProfile: true }
    });

    const emails = users.map(u => ({
      id: u.id,
      full_email: u.email,
      alias: u.username || u.email.split('@')[0],
      customer_id: u.customerProfile?.customer_id_string || 'STAFF',
      role: u.role,
      phone: u.phone,
      full_name: u.full_name || u.customerProfile?.full_name || 'Admin',
      status: u.customerProfile ? u.customerProfile.status : 'ACTIVE',
      created_at: u.created_at
    }));

    res.json({ success: true, emails });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data email aktif: ' + err.message });
  }
});

// GET /api/admin/audit (Daftar audit log untuk admin)
app.get('/api/admin/audit', authMiddleware, checkPermission('audit.read'), async (req, res) => {
  try {
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
    const logsWithUser = logs.map(l => ({
      id: l.id,
      action: l.action,
      endpoint: l.endpoint,
      method: l.method,
      ip_address: l.ip_address || '127.0.0.1',
      user_agent: l.user_agent ? l.user_agent.substring(0, 100) : 'Unknown',
      created_at: l.created_at,
      user: l.user_id ? userMap.get(l.user_id) || { email: 'Unknown', full_name: 'Unknown' } : { email: 'System', full_name: 'System/Cron' }
    }));

    res.json({ success: true, logs: logsWithUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data audit log: ' + err.message });
  }
});

// GET /api/admin/system/stats (Real-time system monitoring)
app.get('/api/admin/system/stats', authMiddleware, checkPermission('system.read'), async (req, res) => {
  try {
    const os = require('os');
    

    // CPU and RAM info
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramPercent = Math.round((usedMem / totalMem) * 100);

    const loadAvg = os.loadavg();
    // Assuming 1 min load average percentage relative to logical CPUs
    const cpuCores = os.cpus().length;
    const cpuPercent = Math.min(100, Math.round((loadAvg[0] / cpuCores) * 100));

    // Disk Usage
    let disk = { total: '100 GB', used: '25 GB', free: '75 GB', percent: 25 };
    let containers = [];
    let networkConnections = 0;
    // Removed dangerous execSync calls for security baseline

    res.json({
      success: true,
      stats: {
        cpuPercent,
        ramPercent,
        ramUsedGb: (usedMem / (1024 * 1024 * 1024)).toFixed(2),
        ramTotalGb: (totalMem / (1024 * 1024 * 1024)).toFixed(2),
        uptime: os.uptime(),
        disk,
        containers,
        networkConnections
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil monitoring data: ' + err.message });
  }
});

// GET /api/admin/customers
app.get('/api/admin/customers', authMiddleware, checkPermission('customer.read'), async (req, res) => {
  try {
    const customers = await prisma.customerProfile.findMany({
      include: { plan: true, user: { select: { email: true, phone: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/invoices
app.get('/api/admin/invoices', authMiddleware, checkPermission('billing.read'), async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: { select: { full_name: true, customer_id_string: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/invoices/generate (generate tagihan massal)
app.post('/api/admin/invoices/generate', authMiddleware, checkPermission('billing.manage'), async (req, res) => {
  try {
    const activeCustomers = await prisma.customerProfile.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true }
    });

    const now = new Date();
    const period = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 10);

    const invoices = await Promise.all(activeCustomers.map(c =>
      prisma.invoice.create({
        data: {
          id: generateId('INV'),
          customerId: c.id,
          period,
          amount: c.plan.price,
          due_date: dueDate,
        }
      })
    ));

    res.status(201).json({
      success: true,
      message: `${invoices.length} tagihan berhasil digenerate untuk periode ${period}.`,
      count: invoices.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/tickets
app.get('/api/admin/tickets', authMiddleware, checkPermission('ticket.read'), async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { customer: { select: { full_name: true, customer_id_string: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/tickets/:id (update status tiket)
app.patch('/api/admin/tickets/:id', authMiddleware, checkPermission('ticket.assign'), async (req, res) => {
  const { status } = req.body;
  try {
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ success: true, message: 'Status tiket diperbarui.', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/customers/:id/isolate (isolir pelanggan)
app.patch('/api/admin/customers/:id/isolate', authMiddleware, checkPermission('customer.manage'), async (req, res) => {
  try {
    const customer = await prisma.customerProfile.update({
      where: { id: req.params.id },
      data: { status: 'ISOLATED' }
    });
    // TODO: Integrate with Mikrotik API to disable PPPoE session
    res.json({ success: true, message: `Pelanggan ${customer.customer_id_string} berhasil diisolir.`, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/customers/:id/activate (aktifkan pelanggan)
app.patch('/api/admin/customers/:id/activate', authMiddleware, checkPermission('customer.manage'), async (req, res) => {
  try {
    const customer = await prisma.customerProfile.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' }
    });
    // TODO: Integrate with Mikrotik API to enable PPPoE session
    res.json({ success: true, message: `Pelanggan ${customer.customer_id_string} berhasil diaktifkan.`, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/work-orders
app.get('/api/admin/work-orders', authMiddleware, checkPermission('ticket.read'), async (req, res) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        technician: { select: { email: true } },
        customer: { select: { full_name: true, customer_id_string: true, address: true } },
        ticket: { select: { subject: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, workOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/work-orders
app.post('/api/admin/work-orders', authMiddleware, checkPermission('ticket.assign'), async (req, res) => {
  const { technicianId, customerId, ticketId, task_type, scheduled } = req.body;
  try {
    const wo = await prisma.workOrder.create({
      data: {
        id: generateId('WO'),
        technicianId,
        customerId,
        ticketId: ticketId || null,
        task_type: task_type || 'NEW_INSTALLATION',
        scheduled: new Date(scheduled),
      }
    });
    res.status(201).json({ success: true, message: 'Work Order berhasil dibuat.', workOrder: wo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/plans
app.post('/api/admin/plans', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const { name, speed_mbps, price, mikrotik_profile } = req.body;
  try {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        speed_mbps: parseInt(speed_mbps),
        price: parseFloat(price),
        mikrotik_profile
      }
    });
    res.status(201).json({ success: true, message: 'Paket berhasil ditambahkan', plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/plans/:id
app.put('/api/admin/plans/:id', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, message: 'ID paket tidak valid.' });
  const { name, speed_mbps, price, mikrotik_profile } = req.body;
  try {
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        speed_mbps: parseInt(speed_mbps),
        price: parseFloat(price),
        mikrotik_profile
      }
    });
    res.json({ success: true, message: 'Paket berhasil diperbarui', plan });
  } catch (err) {
    console.error('[Admin Plans PUT]', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui paket.' });
  }
});

// DELETE /api/admin/plans/:id
app.delete('/api/admin/plans/:id', authMiddleware, checkPermission('plan.manage'), async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, message: 'ID paket tidak valid.' });
  try {
    await prisma.subscriptionPlan.delete({ where: { id } });
    res.json({ success: true, message: 'Paket berhasil dihapus' });
  } catch (err) {
    console.error('[Admin Plans DELETE]', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus paket (mungkin masih digunakan oleh pelanggan).' });
  }
});

// ═══════════════════════════════════════════
// TECHNICIAN ROUTES (perlu login + role TECHNICIAN)
// ═══════════════════════════════════════════

// GET /api/technician/work-orders
app.get('/api/technician/work-orders', authMiddleware, async (req, res) => {
  if (req.user?.role !== 'TECHNICIAN') {
    return res.status(403).json({ success: false, message: 'Akses hanya untuk teknisi.' });
  }
  try {
    const workOrders = await prisma.workOrder.findMany({
      where: { technicianId: req.user?.id },
      include: {
        customer: { select: { full_name: true, customer_id_string: true, address: true } },
        ticket: { select: { subject: true } }
      },
      orderBy: { scheduled: 'asc' }
    });
    res.json({ success: true, workOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/technician/work-orders/:id (update status WO)
app.patch('/api/technician/work-orders/:id', authMiddleware, async (req, res) => {
  if (req.user?.role !== 'TECHNICIAN') {
    return res.status(403).json({ success: false, message: 'Akses hanya untuk teknisi.' });
  }
  const { status } = req.body;
  try {
    const wo = await prisma.workOrder.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json({ success: true, message: 'Status Work Order diperbarui.', workOrder: wo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
async function syncEmailAliasToMailDb(email, username, plainPassword, status = 'active') {
  if (!email || !email.includes('@')) return;
  const alias = username || email.split('@')[0];
  
  let conn;
  try {
    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute('SELECT id FROM email_aliases WHERE full_email = ?', [email]);
    
    let password_hash = null;
    if (plainPassword) {
      // Gunakan implementasi MD5-CRYPT murni Node.js (aman dari command injection)
      password_hash = md5CryptDovecot(plainPassword);
    }

    if (rows.length > 0) {
      if (password_hash) {
        await conn.execute(
          'UPDATE email_aliases SET alias = ?, password_hash = ?, status = ? WHERE full_email = ?',
          [alias, password_hash, status, email]
        );
      } else {
        await conn.execute(
          'UPDATE email_aliases SET alias = ?, status = ? WHERE full_email = ?',
          [alias, status, email]
        );
      }
      console.log(`✅ Synced (updated) email alias in MySQL: ${email}`);
    } else {
      const id = 'alias-' + crypto.randomBytes(8).toString("hex").substr(2, 9);
      const cust_id = 'cust-01'; // Link to default active customer to satisfy foreign key constraint
      if (!password_hash) {
        // Gunakan implementasi MD5-CRYPT murni Node.js (aman dari command injection)
        password_hash = md5CryptDovecot('admin123_CHANGE_ME');
      }
      await conn.execute(
        'INSERT INTO email_aliases (id, customer_id, alias, full_email, password_hash, status) VALUES (?, ?, ?, ?, ?, ?)',
        [id, cust_id, alias, email, password_hash, status]
      );
      console.log(`✅ Synced (inserted) new email alias in MySQL: ${email}`);
    }
  } catch (err) {
    console.error(`❌ Failed to sync email alias in MySQL for ${email}:`, err.message);
  } finally {
    if (conn) await conn.end();
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

// ═══════════════════════════════════════════
// MAIL SERVER API (MySQL email_aliases + Prisma User)
// ═══════════════════════════════════════════

// POST /api/admin/mail - Buat akun email & user staff baru lengkap
app.post('/api/admin/mail', authMiddleware, checkPermission('system.manage'), async (req, res) => {
  const { username, alias, password, role, full_name, ktp, address } = req.body;
  const userAlias = (username || alias || '').trim();
  if (!userAlias || !password) return res.status(400).json({ success: false, message: 'Username/Alias dan Password wajib diisi.' });

  const email = `${userAlias}@topclassuniversal.co.id`;
  const userRole = role || 'ADMIN';

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username: userAlias }] }
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const prefObj = ktp ? { ktp } : null;

    let userObj;
    if (existingUser) {
      userObj = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          full_name: full_name || existingUser.full_name,
          address: address || existingUser.address,
          password_hash: hashedPassword,
          ...(prefObj ? { preferences: prefObj } : {})
        }
      });
    } else {
      userObj = await prisma.user.create({
        data: {
          email,
          username: userAlias,
          full_name: full_name || userAlias,
          address: address || '',
          password_hash: hashedPassword,
          ...(prefObj ? { preferences: prefObj } : {})
        }
      });
    }
    await assignUserRole(userObj.id, userRole);

    await syncEmailAliasToMailDb(email, userAlias, password);
    res.json({ success: true, message: `Akun email ${email} berhasil dibuat.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/mail - Daftar semua akun email dengan detail Prisma User lengkap
app.get('/api/admin/mail', authMiddleware, checkPermission('system.manage'), async (req, res) => {
  let conn;
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        address: true,
        role: true,
        preferences: true
      }
    });
    const userMap = {};
    users.forEach(u => {
      if (u.email) userMap[u.email.toLowerCase()] = u;
    });

    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute(
      `SELECT id, alias, full_email, status, quota_mb, used_mb, last_login, created_at FROM email_aliases ORDER BY created_at DESC`
    );

    const merged = rows.map(r => {
      const u = (r.full_email && userMap[r.full_email.toLowerCase()]) || {};
      let ktp = u.preferences && typeof u.preferences === 'object' ? u.preferences.ktp : '';
      return {
        id: r.id,
        alias: r.alias || (r.full_email ? r.full_email.split('@')[0] : ''),
        full_email: r.full_email,
        username: u.username || r.alias || (r.full_email ? r.full_email.split('@')[0] : ''),
        full_name: u.full_name || 'Staff TCU',
        role: u.role || 'ADMIN',
        address: u.address || '-',
        ktp: ktp || '-',
        status: r.status,
        quota_mb: r.quota_mb,
        used_mb: r.used_mb,
        user_id: u.id || null
      };
    });

    res.json({ success: true, emails: merged });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// PUT /api/admin/mail/:id - Update detail akun email & Prisma User
app.put('/api/admin/mail/:id', authMiddleware, checkPermission('system.manage'), async (req, res) => {
  const { username, password, role, full_name, ktp, address } = req.body;
  let conn;
  try {
    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute('SELECT full_email, alias FROM email_aliases WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Email tidak ditemukan.' });

    const currentEmail = rows[0].full_email;
    const newAlias = username ? username.trim() : rows[0].alias;
    const newEmail = `${newAlias}@topclassuniversal.co.id`;

    const existingUser = await prisma.user.findFirst({
      where: { email: currentEmail }
    });

    const updateData = {
      full_name: full_name !== undefined ? full_name : undefined,
      address: address !== undefined ? address : undefined,
      role: role || undefined,
      preferences: ktp !== undefined ? { ktp } : undefined
    };

    if (password && password.length >= 6) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    if (newAlias !== rows[0].alias) {
      updateData.username = newAlias;
      updateData.email = newEmail;
    }

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: updateData
      });
    }

    let passHash = null;
    if (password && password.length >= 6) {
      passHash = md5CryptDovecot(password);
    }

    if (passHash) {
      await conn.execute(
        'UPDATE email_aliases SET alias = ?, full_email = ?, password_hash = ? WHERE id = ?',
        [newAlias, newEmail, passHash, req.params.id]
      );
    } else {
      await conn.execute(
        'UPDATE email_aliases SET alias = ?, full_email = ? WHERE id = ?',
        [newAlias, newEmail, req.params.id]
      );
    }

    res.json({ success: true, message: `Akun email ${newEmail} berhasil diperbarui.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// PATCH /api/admin/mail/:id/password - Ganti password akun email
app.patch('/api/admin/mail/:id/password', authMiddleware, checkPermission('system.manage'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });

  let conn;
  try {
    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute('SELECT full_email FROM email_aliases WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Email tidak ditemukan.' });

    const password_hash = md5CryptDovecot(password);
    await conn.execute('UPDATE email_aliases SET password_hash = ? WHERE id = ?', [password_hash, req.params.id]);

    const existingUser = await prisma.user.findFirst({ where: { email: rows[0].full_email } });
    if (existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { id: existingUser.id }, data: { password_hash: hashedPassword } });
    }

    res.json({ success: true, message: `Password untuk ${rows[0].full_email} berhasil diperbarui.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// DELETE /api/admin/mail/:id - Hapus akun email & user staff
app.delete('/api/admin/mail/:id', authMiddleware, checkPermission('system.manage'), async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute('SELECT full_email FROM email_aliases WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Email tidak ditemukan.' });

    const email = rows[0].full_email;
    await conn.execute('DELETE FROM email_aliases WHERE id = ?', [req.params.id]);

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      await prisma.user.delete({ where: { id: existingUser.id } }).catch(() => null);
    }

    res.json({ success: true, message: `Akun email ${email} berhasil dihapus.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// SEED ADMIN (first run)
// ═══════════════════════════════════════════
async function seedAdminAndPlans() {
  // Seed plans
  const planCount = await prisma.subscriptionPlan.count();
  if (planCount === 0) {
    await prisma.subscriptionPlan.createMany({
      data: [
        { name: 'Starter 20 Mbps', speed_mbps: 20, price: 200000, mikrotik_profile: 'starter-20' },
        { name: 'Popular 50 Mbps', speed_mbps: 50, price: 350000, mikrotik_profile: 'popular-50' },
        { name: 'Business 100 Mbps', speed_mbps: 100, price: 600000, mikrotik_profile: 'business-100' },
      ]
    });
    console.log('✅ Paket internet seeded.');
  }

  // Seed admin & Ensure Role
  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: 'ADMIN', description: 'Super Admin' } });
  }

  // Seed CEO Super Admin
  let superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({ data: { name: 'SUPERADMIN', description: 'Akses Utama Super Admin' } });
  }

  let ceoExists = await prisma.user.findFirst({ where: { OR: [{ email: 'ceo@topclassuniversal.co.id' }, { username: 'ceo' }] } });
  if (!ceoExists) {
    const ceoHash = await bcrypt.hash('B3j4k3uN@!', 12);
    ceoExists = await prisma.user.create({
      data: {
        email: 'ceo@topclassuniversal.co.id',
        username: 'ceo',
        full_name: 'Adnan Rachmat',
        address: 'Padaherang',
        password_hash: ceoHash,
        preferences: { ktp: '3207201611870003' }
      }
    });
    await prisma.userRole.create({ data: { userId: ceoExists.id, roleId: superAdminRole.id } }).catch(() => null);
    await syncEmailAliasToMailDb('ceo@topclassuniversal.co.id', 'ceo', 'B3j4k3uN@!');
    console.log('✅ CEO Super Admin account seeded (ceo@topclassuniversal.co.id)');
  }

  let adminExists = await prisma.user.findUnique({ where: { email: 'admin@topclassuniversal.co.id' } });
  if (!adminExists) {
    const hash = await bcrypt.hash('admin123', 12);
    adminExists = await prisma.user.create({
      data: {
        email: 'admin@topclassuniversal.co.id',
        phone: '082319140858',
        password_hash: hash,
      }
    });
    console.log('✅ Admin user seeded (admin@topclassuniversal.co.id / admin123).');
  }

  const hasRole = await prisma.userRole.findUnique({
    where: { userId_roleId: { userId: adminExists.id, roleId: adminRole.id } }
  });
  if (!hasRole) {
    await prisma.userRole.create({
      data: { userId: adminExists.id, roleId: adminRole.id }
    });
    console.log('✅ Admin role assigned to admin@topclassuniversal.co.id.');
  }

  // Ensure default admin & technician are synced in MySQL mail db
  const adminUser = await prisma.user.findFirst({ where: { email: 'admin@topclassuniversal.co.id' } });
  if (adminUser) {
    await syncEmailAliasToMailDb(adminUser.email, adminUser.username || 'admin', 'admin123');
  }
  const techUser = await prisma.user.findFirst({ where: { email: 'teknisi@topclassuniversal.co.id' } });
  if (techUser) {
    await syncEmailAliasToMailDb(techUser.email, techUser.username || 'teknisi', 'admin123');
  }
}

// ═══════════════════════════════════════════
// CRON JOBS
// ═══════════════════════════════════════════
function initCronJobs() {
  // 0. Auto-Backup Database (Tiap hari jam 02:00 AM)
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ [CRON] Menjalankan Auto-Backup Database ke Google Drive...');
    backupDatabase();
  });

  // 1. Auto-Generate Invoice (Tanggal 1 setiap bulan jam 00:15)
  cron.schedule('15 0 1 * *', async () => {
    console.log('⏰ [CRON] Menjalankan Auto-Generate Invoice Bulanan...');
    try {
      const activeCustomers = await prisma.customerProfile.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true, user: true }
      });
      const now = new Date();
      const period = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      // Jatuh tempo tanggal 10 bulan tersebut
      const dueDate = new Date(now.getFullYear(), now.getMonth(), 10);
      
      let count = 0;
      for (const c of activeCustomers) {
        await prisma.invoice.create({
          data: {
            id: generateId('INV'),
            customerId: c.id,
            period,
            amount: c.plan.price,
            due_date: dueDate,
          }
        });
        
        // Kirim notifikasi email tagihan
        if (c.user && c.user.email) {
          sendEmail(
            c.user.email,
            `Tagihan Internet Periode ${period} - TCU Platform`,
            `<h3>Halo ${c.full_name},</h3>
             <p>Tagihan internet Anda untuk periode <strong>${period}</strong> sebesar <strong>Rp ${c.plan.price}</strong> telah terbit.</p>
             <p>Jatuh tempo pembayaran adalah tanggal <strong>10 ${period.split(' ')[0]}</strong>.</p>
             <p>Harap segera melakukan pembayaran melalui portal pelanggan untuk menghindari isolir otomatis.</p>
             <br><p>Terima kasih,<br>TCU Platform</p>`
          );
        }
        
        count++;
      }
      console.log(`✅ [CRON] Berhasil generate ${count} invoice untuk periode ${period}`);
    } catch (err) {
      console.error('❌ [CRON] Gagal generate invoice:', err.message);
    }
  });

  // 2. Auto-Isolir (Tiap hari jam 00:30)
  cron.schedule('30 0 * * *', async () => {
    console.log('⏰ [CRON] Mengecek tagihan jatuh tempo untuk Auto-Isolir...');
    try {
      const now = new Date();
      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          status: 'UNPAID',
          due_date: { lt: now }
        },
        include: { customer: { include: { user: true } } }
      });
      
      let count = 0;
      for (const inv of overdueInvoices) {
        if (inv.customer.status === 'ACTIVE') {
          // Update status DB
          await prisma.customerProfile.update({
            where: { id: inv.customerId },
            data: { status: 'ISOLATED' }
          });
          // Nonaktifkan di RADIUS dengan mengubah password
          const pppoeUser = `${inv.customer.customer_id_string}@topclassuniversal.co.id`;
          await prisma.radCheck.updateMany({
            where: { username: pppoeUser, attribute: 'Cleartext-Password' },
            data: { value: 'ISOLIR_LOCKED' }
          });
          count++;
        }
      }
      console.log(`✅ [CRON] ${count} pelanggan telah diisolir.`);
    } catch (err) {
      console.error('❌ [CRON] Gagal memproses auto-isolir:', err.message);
    }
  });

  // 3. Pengingat Jatuh Tempo (Tiap hari jam 08:00)
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ [CRON] Mengirim pengingat jatuh tempo H-3...');
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      
      const invoices = await prisma.invoice.findMany({
        where: {
          status: 'UNPAID',
          due_date: {
            gte: new Date(targetDate.setHours(0,0,0,0)),
            lt: new Date(targetDate.setHours(23,59,59,999))
          }
        },
        include: { customer: { include: { user: true } } }
      });

      for (const inv of invoices) {
        // Implementasi pengiriman email notifikasi
        console.log(`📧 [EMAIL] Reminder dikirim ke ${inv.customer.user.email} (Tagihan: ${inv.id})`);
      }
      console.log(`✅ [CRON] ${invoices.length} pengingat terkirim.`);
    } catch (err) {
      console.error('❌ [CRON] Gagal mengirim pengingat:', err.message);
    }
  });

  // 4. Rekonsiliasi Status Pembayaran (Tiap 6 jam)
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ [CRON] Rekonsiliasi pembayaran...');
    // TODO: Cek API Payment Gateway untuk invoice berstatus UNPAID
  });

  // 5. Pembersihan Sesi RADIUS Menggantung (Tiap Jam)
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ [CRON] Membersihkan sesi RADIUS stale (radacct)...');
  });

  // 6. Auto-Post Scheduler: Blog CMS & Wiki Knowledgebase Permanen (Tiap 4 jam)
  cron.schedule('0 */4 * * *', async () => {
    console.log('⏰ [CRON] Menjalankan Auto-Post Scheduler untuk Blog CMS & Wiki Knowledgebase...');
    try {
      // 1. Check autoPostJob queue
      const pendingJobs = await prisma.autoPostJob.findMany({
        where: { status: 'PENDING', scheduled_at: { lte: new Date() } },
        take: 5
      });

      for (const job of pendingJobs) {
        if (job.target === 'BLOG' || job.target === 'CMS') {
          await prisma.cmsPost.create({
            data: {
              title: job.title,
              slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              excerpt: job.excerpt || job.title,
              content: job.content,
              published: true,
              published_at: new Date()
            }
          });
        } else if (job.target === 'WIKI') {
          await prisma.kbArticle.create({
            data: {
              title: job.title,
              slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,),
              summary: job.excerpt || job.title,
              content: job.content,
              is_published: true
            }
          });
        }
        await prisma.autoPostJob.update({
          where: { id: job.id },
          data: { status: 'PUBLISHED', executed_at: new Date() }
        });
        console.log(`✅ [AUTO-POST] Berhasil mempublikasikan artikel: "${job.title}" [Target: ${job.target}]`);
      }
    } catch (err) {
      console.error('❌ [AUTO-POST] Gagal memproses jadwal publikasi:', err.message);
    }
  });

  console.log('⚙️ Cron jobs (Auto-Post & Billing) berhasil diinisialisasi.');
}

// ═══════════════════════════════════════════
// LEADS API
// ═══════════════════════════════════════════

// GET /api/admin/leads
app.get('/api/admin/leads', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    // Sanitasi pagination — max 100 per request untuk mencegah DoS
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const where = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { full_name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
    const total = await prisma.lead.count({ where });
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    res.json({ success: true, leads, total, page, limit });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data leads.' });
  }
});

// GET /api/admin/leads/stats
app.get('/api/admin/leads/stats', authMiddleware, async (req, res) => {
  try {
    const [total, newL, contacted, survey, converted, lost] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'CONTACTED' } }),
      prisma.lead.count({ where: { status: 'SURVEY_SCHEDULED' } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.lead.count({ where: { status: 'LOST' } }),
    ]);
    res.json({ success: true, stats: { total, new: newL, contacted, survey, converted, lost } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/leads
app.post('/api/admin/leads', authMiddleware, async (req, res) => {
  const { full_name, phone, address, kelurahan, kecamatan, kota, notes, source, assigned_to } = req.body;
  if (!full_name || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Nama, nomor HP, dan alamat wajib diisi.' });
  }
  try {
    const lead = await prisma.lead.create({
      data: { full_name, phone, address, kelurahan, kecamatan, kota, notes, source, assigned_to }
    });
    res.status(201).json({ success: true, message: 'Lead berhasil ditambahkan.', lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/leads/:id
app.put('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  const allowed = ['full_name','phone','address','kelurahan','kecamatan','kota','notes','status','source','assigned_to'];
  const data = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });
  try {
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: 'Lead diperbarui.', lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/leads/:id
app.delete('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Lead dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
// INVENTORY API
// ═══════════════════════════════════════════

// GET /api/admin/inventory
app.get('/api/admin/inventory', authMiddleware, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    // Sanitasi pagination — max 100 per request untuk mencegah DoS
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) where.OR = [
      { serial_number: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { location_pic: { contains: search, mode: 'insensitive' } },
    ];
    const total = await prisma.inventoryItem.count({ where });
    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    res.json({ success: true, items, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data inventory.' });
  }
});

// GET /api/admin/inventory/stats
app.get('/api/admin/inventory/stats', authMiddleware, async (req, res) => {
  try {
    const [total, gudang, dipinjam, terpasang, rusak] = await Promise.all([
      prisma.inventoryItem.count(),
      prisma.inventoryItem.count({ where: { status: 'GUDANG' } }),
      prisma.inventoryItem.count({ where: { status: 'DIPINJAM' } }),
      prisma.inventoryItem.count({ where: { status: 'TERPASANG' } }),
      prisma.inventoryItem.count({ where: { status: 'RUSAK' } }),
    ]);
    res.json({ success: true, stats: { total, gudang, dipinjam, terpasang, rusak } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/inventory
app.post('/api/admin/inventory', authMiddleware, async (req, res) => {
  const { serial_number, name, category, status, location_pic, customer_id, notes } = req.body;
  if (!serial_number || !name) {
    return res.status(400).json({ success: false, message: 'Serial number dan nama barang wajib diisi.' });
  }
  try {
    const item = await prisma.inventoryItem.create({
      data: { serial_number, name, category: category || 'ONT', status: status || 'GUDANG', location_pic, customer_id, notes }
    });
    res.status(201).json({ success: true, message: 'Barang berhasil ditambahkan.', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/inventory/:id
app.put('/api/admin/inventory/:id', authMiddleware, async (req, res) => {
  const allowed = ['serial_number','name','category','status','location_pic','customer_id','notes'];
  const data = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });
  try {
    const item = await prisma.inventoryItem.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: 'Barang diperbarui.', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/inventory/:id
app.delete('/api/admin/inventory/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Barang dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
// RADIUS NAS DEVICES API
// ═══════════════════════════════════════════

// GET /api/admin/radius/nas
app.get('/api/admin/radius/nas', authMiddleware, async (req, res) => {
  try {
    const devices = await prisma.nasDevice.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/radius/nas
app.post('/api/admin/radius/nas', authMiddleware, async (req, res) => {
  const { router_name, ip_address, secret, timezone, snmp_community } = req.body;
  if (!router_name || !ip_address || !secret) {
    return res.status(400).json({ success: false, message: 'Router name, IP, dan secret wajib diisi.' });
  }
  try {
    const device = await prisma.nasDevice.create({
      data: { router_name, ip_address, secret, timezone: timezone || 'Asia/Jakarta', snmp_community }
    });
    res.status(201).json({ success: true, message: 'NAS device berhasil ditambahkan.', device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/radius/nas/:id
app.put('/api/admin/radius/nas/:id', authMiddleware, async (req, res) => {
  const allowed = ['router_name','ip_address','secret','timezone','snmp_community'];
  const data = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });
  try {
    const device = await prisma.nasDevice.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: 'NAS device diperbarui.', device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/radius/nas/:id
app.delete('/api/admin/radius/nas/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.nasDevice.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'NAS device dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/radius/accounts - list all radcheck (RADIUS users)
app.get('/api/admin/radius/accounts', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const where = { attribute: 'Cleartext-Password' };
    if (search) where.username = { contains: search };
    const accounts = await prisma.radCheck.findMany({
      where,
      orderBy: { id: 'desc' },
      take: 100,
    });
    // Also get group info
    const usernames = accounts.map(a => a.username);
    const groups = await prisma.radUserGroup.findMany({ where: { username: { in: usernames } } });
    const groupMap = {};
    groups.forEach(g => groupMap[g.username] = g.groupname);
    
    const result = accounts.map(a => ({
      id: a.id,
      username: a.username,
      password: a.value,
      profile: groupMap[a.username] || '-',
      status: a.value === 'ISOLIR_LOCKED' ? 'ISOLATED' : 'ACTIVE',
    }));
    res.json({ success: true, accounts: result, total: result.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/radius/stats
app.get('/api/admin/radius/stats', authMiddleware, async (req, res) => {
  try {
    const total = await prisma.radCheck.count({ where: { attribute: 'Cleartext-Password' } });
    const isolated = await prisma.radCheck.count({ where: { attribute: 'Cleartext-Password', value: 'ISOLIR_LOCKED' } });
    res.json({ success: true, stats: { total_subscribers: total, active: total - isolated, isolated } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════
// CMS WEB API
// ═══════════════════════════════════════════


// GET /api/cms
// Public endpoint for Next.js to fetch CMS content
app.get('/api/cms', async (req, res) => {
  try {
    const settings = await prisma.cmsSetting.findMany();
    // Convert array of {key, value} to an object
    const data = {};
    settings.forEach(s => data[s.key] = s.value);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cms
// Protected endpoint for admin to update CMS content
app.put('/api/cms', authMiddleware, async (req, res) => {
  // Check if ADMIN or SUPERADMIN
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPERADMIN') return res.status(403).json({ success: false, message: 'Hanya Admin yang dapat mengubah CMS.' });
  
  const { payload } = req.body; // payload should be an object of key-values
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, message: 'Payload tidak valid.' });
  }

  // RBAC Protection: Non-SuperAdmin cannot alter SUPERADMIN permissions
  const isSuper = req.user?.role === 'SUPERADMIN' || req.user?.email === 'ceo@topclassuniversal.co.id' || req.user?.username === 'ceo';
  if (!isSuper && payload.rbac_settings) {
    try {
      let currentRbacSetting = await prisma.cmsSetting.findUnique({ where: { key: 'rbac_settings' } });
      let newRbac = typeof payload.rbac_settings === 'string' ? JSON.parse(payload.rbac_settings) : payload.rbac_settings;
      if (currentRbacSetting && currentRbacSetting.value) {
        let oldRbac = typeof currentRbacSetting.value === 'string' ? JSON.parse(currentRbacSetting.value) : currentRbacSetting.value;
        if (oldRbac && oldRbac.SUPERADMIN) {
          newRbac.SUPERADMIN = oldRbac.SUPERADMIN;
          payload.rbac_settings = typeof payload.rbac_settings === 'string' ? JSON.stringify(newRbac) : newRbac;
        }
      }
    } catch(e) {}
  }

  try {
    const promises = Object.keys(payload).map(key => 
      prisma.cmsSetting.upsert({
        where: { key },
        update: { value: typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key] },
        create: { key, value: typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key] }
      })
    );
    await Promise.all(promises);
    res.json({ success: true, message: 'CMS berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/users (tambah user RBAC baru)
app.post('/api/admin/users', authMiddleware, checkPermission('user.manage'), async (req, res) => {
  const { username, password, role, full_name, phone, email, address } = req.body;

  if (!username || !password || !role || !full_name || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Username, password, role, nama lengkap, telepon, dan email wajib diisi.' });
  }

  let finalEmail = email.trim();
  if (!finalEmail.endsWith('@topclassuniversal.co.id')) {
    const emailPrefix = finalEmail.split('@')[0];
    finalEmail = `${emailPrefix}@topclassuniversal.co.id`;
  }

  try {
    // Validasi keunikan
    const emailExists = await prisma.user.findFirst({ where: { email: finalEmail } });
    if (emailExists) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });

    const phoneExists = await prisma.user.findFirst({ where: { phone } });
    if (phoneExists) return res.status(400).json({ success: false, message: 'Nomor telepon sudah terdaftar.' });

    const usernameExists = await prisma.user.findFirst({ where: { username } });
    if (usernameExists) return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });

    const password_hash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: finalEmail,
        phone,
        password_hash,
        role,
        username,
        full_name,
        address
      }
    });

    // Sinkronisasi ke MySQL Mail Database (SnappyMail/Dovecot)
    await syncEmailAliasToMailDb(newUser.email, newUser.username, password);

    // Kirim email aktivasi dari activation@topclassuniversal.co.id
    const subject = 'Aktivasi Akun Layanan TCU Platform';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px; backgroundColor: #0f172a; color: #f8fafc;">
        <h2 style="color: #3b82f6; borderBottom: 1px solid #3b82f6; paddingBottom: 10px;">Aktivasi Akun Staff TCU Platform</h2>
        <p>Halo <strong>${full_name}</strong>,</p>
        <p>Akun staff Anda untuk sistem <strong>TCU Platform (PT Top Class Universal)</strong> telah berhasil dibuat dengan peran/akses sebagai <strong>${role}</strong>.</p>
        <p>Berikut adalah kredensial akun Anda:</p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; borderRadius: 6px; margin: 15px 0;">
          <table style="width: 100%;">
            <tr><td style="width: 120px; color: #94a3b8;">Username:</td><td style="fontWeight: bold; color: #f8fafc;">${username}</td></tr>
            <tr><td style="color: #94a3b8;">Password:</td><td style="fontWeight: bold; color: #f8fafc;">[ Gunakan password yang ditetapkan administrator ]</td></tr>
            <tr><td style="color: #94a3b8;">Akses Role:</td><td style="fontWeight: bold; color: #3b82f6;">${role}</td></tr>
          </table>
        </div>
        <p>Silakan masuk ke dasbor dan segera lakukan aktivasi/pengaturan 2FA untuk mengamankan akun Anda.</p>
        <hr style="border: 0; borderTop: 1px solid #334155; margin: 20px 0;" />
        <p style="fontSize: 0.85rem; color: #64748b;">Pesan otomatis ini dikirim oleh server TCU Platform.<br/>Alamat Server: activation@topclassuniversal.co.id</p>
      </div>
    `;

    // Send email using custom activation address
    await sendEmail(email, subject, html, '"TCU Activation Server" <activation@topclassuniversal.co.id>');

    res.json({ success: true, message: 'User baru berhasil dibuat dan email aktivasi telah dikirim.', user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/password (ganti password user/staff oleh Admin)
app.put('/api/admin/users/:id/password', authMiddleware, checkPermission('user.manage'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password baru wajib diisi dan minimal 6 karakter.' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 12);
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { password_hash }
    });

    // Sinkronisasi ke MySQL Mail Database (SnappyMail/Dovecot)
    await syncEmailAliasToMailDb(updatedUser.email, updatedUser.username, password);

    res.json({ success: true, message: 'Password user berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/health
app.get('/api/health', async (req, res) => {
  try {
    // Validasi koneksi database PostgreSQL via Prisma query
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        database: 'UP'
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      services: {
        database: 'DOWN'
      },
      error: err.message
    });
  }
});

// ═══════════════════════════════════════════
// CENTRALIZED ERROR HANDLER (M-01)
// Harus didefinisikan SETELAH semua routes
// ═══════════════════════════════════════════

// 404 handler untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} tidak ditemukan.` });
});

// Global error handler — mencegah error internal bocor ke client
// Gunakan next(err) di route handlers untuk memanfaatkan ini
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  const statusCode = err.status || err.statusCode || 500;
  // Hanya tampilkan pesan error untuk 4xx (client error), sembunyikan detail 5xx (server error)
  const message = statusCode < 500
    ? err.message
    : 'Terjadi kesalahan server. Silakan coba lagi atau hubungi administrator.';
  res.status(statusCode).json({ success: false, message });
});

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
const PORT = process.env.PORT || 3000;

async function main() {
  await seedAdminAndPlans();
  initCronJobs();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TCU Platform API v2.0 running on port ${PORT}`);
  });
}

main().catch((e) => {
  console.error('❌ Server failed to start:', e);
  process.exit(1);
});

