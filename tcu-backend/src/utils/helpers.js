/**
 * @file helpers.js
 * @description Helper functions shared across the modular controllers of TCU Platform
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const mailDbConfig = {
  host: process.env.MAIL_DB_HOST || '127.0.0.1',
  user: process.env.MAIL_DB_USER || 'mailreader',
  password: process.env.MAIL_DB_PASSWORD,
  database: process.env.MAIL_DB_NAME || 'topclass_portal'
};

const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 25,
  secure: false,
  ignoreTLS: true
});

async function sendEmail(to, subject, html, fromAddress = '"TCU Platform" <noreply@topclassuniversal.co.id>') {
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

function md5CryptDovecot(password) {
  const saltChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const saltArr = Array.from({ length: 8 }, () => saltChars[crypto.randomInt(0, saltChars.length)]);
  const salt = saltArr.join('');

  const pass = Buffer.from(password);
  const saltBuf = Buffer.from(salt);
  const magic = Buffer.from('$1$');

  const ctxA = crypto.createHash('md5');
  ctxA.update(pass);
  ctxA.update(magic);
  ctxA.update(saltBuf);

  const ctxB = crypto.createHash('md5');
  ctxB.update(pass);
  ctxB.update(saltBuf);
  ctxB.update(pass);
  const digestB = ctxB.digest();

  let i;
  for (i = pass.length; i > 0; i -= 16) {
    ctxA.update(digestB.slice(0, Math.min(i, 16)));
  }

  for (i = pass.length; i > 0; i >>= 1) {
    if (i & 1) ctxA.update(Buffer.from([0]));
    else ctxA.update(pass.slice(0, 1));
  }

  let digestA = ctxA.digest();

  for (i = 0; i < 1000; i++) {
    const ctx = crypto.createHash('md5');
    if (i & 1) ctx.update(pass); else ctx.update(digestA);
    if (i % 3) ctx.update(saltBuf);
    if (i % 7) ctx.update(pass);
    if (i & 1) ctx.update(digestA); else ctx.update(pass);
    digestA = ctx.digest();
  }

  const to64 = (v, n) => {
    const chars = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    while (n-- > 0) { result += chars[v & 0x3f]; v >>= 6; }
    return result;
  };
  const d = digestA;
  const hash = [
    to64((d[0] << 16) | (d[6] << 8) | d[12], 4),
    to64((d[1] << 16) | (d[7] << 8) | d[13], 4),
    to64((d[2] << 16) | (d[8] << 8) | d[14], 4),
    to64((d[3] << 16) | (d[9] << 8) | d[15], 4),
    to64((d[4] << 16) | (d[10] << 8) | d[5], 4),
    to64(d[11], 2),
  ].join('');

  return `{MD5-CRYPT}$1$${salt}$${hash}`;
}

async function syncEmailAliasToMailDb(email, username, plainPassword, status = 'active') {
  if (!email || !email.includes('@')) return;
  const alias = username || email.split('@')[0];
  
  let conn;
  try {
    conn = await mysql.createConnection(mailDbConfig);
    const [rows] = await conn.execute('SELECT id FROM email_aliases WHERE full_email = ?', [email]);
    
    let password_hash = null;
    if (plainPassword) {
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
      const cust_id = 'cust-01'; // Default link
      if (!password_hash) {
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

function generateId(prefix) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = String(crypto.randomInt(0, 9999)).padStart(4, '0');
  return `${prefix}-${year}${month}-${rand}`;
}

module.exports = {
  prisma,
  sendEmail,
  md5CryptDovecot,
  syncEmailAliasToMailDb,
  generateId,
  mailDbConfig
};
