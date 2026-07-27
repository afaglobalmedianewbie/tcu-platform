const { prisma, syncEmailAliasToMailDb } = require('./src/utils/helpers');
const bcrypt = require('bcryptjs');

async function syncAllAdmins() {
  console.log('🚀 Synchronizing all admin accounts (CEO & Admin)...');

  // 1. Ensure SUPERADMIN & ADMIN roles exist
  let superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({ data: { name: 'SUPERADMIN', description: 'Super Admin Utama' } });
  }

  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: 'ADMIN', description: 'Administrator' } });
  }

  // 2. Sync CEO Super Admin: ceo@topclassuniversal.co.id
  const ceoPass = 'B3j4k3uN@!';
  const ceoHash = await bcrypt.hash(ceoPass, 10);
  
  let ceoUser = await prisma.user.findFirst({
    where: { OR: [{ email: 'ceo@topclassuniversal.co.id' }, { username: 'ceo' }] }
  });

  if (ceoUser) {
    ceoUser = await prisma.user.update({
      where: { id: ceoUser.id },
      data: {
        email: 'ceo@topclassuniversal.co.id',
        username: 'ceo',
        full_name: 'Adnan Rachmat',
        address: 'Padaherang',
        password_hash: ceoHash,
        twoFactorEnabled: false,
        preferences: { ktp: '3207201611870003' }
      }
    });
  } else {
    ceoUser = await prisma.user.create({
      data: {
        email: 'ceo@topclassuniversal.co.id',
        username: 'ceo',
        full_name: 'Adnan Rachmat',
        address: 'Padaherang',
        password_hash: ceoHash,
        twoFactorEnabled: false,
        preferences: { ktp: '3207201611870003' }
      }
    });
  }

  // Link CEO to SUPERADMIN role
  await prisma.userRole.deleteMany({ where: { userId: ceoUser.id } }).catch(() => null);
  await prisma.userRole.create({ data: { userId: ceoUser.id, roleId: superAdminRole.id } }).catch(() => null);
  await syncEmailAliasToMailDb('ceo@topclassuniversal.co.id', 'ceo', ceoPass);

  // 3. Sync Admin: admin@topclassuniversal.co.id
  const adminPass = 'admin123';
  const adminHash = await bcrypt.hash(adminPass, 10);

  let adminUser = await prisma.user.findFirst({
    where: { OR: [{ email: 'admin@topclassuniversal.co.id' }, { username: 'admin' }] }
  });

  if (adminUser) {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        email: 'admin@topclassuniversal.co.id',
        username: 'admin',
        full_name: 'Super Admin',
        address: 'Kantor Pusat TCU',
        password_hash: adminHash,
        twoFactorEnabled: false,
        preferences: { ktp: '3207201611870003' }
      }
    });
  } else {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@topclassuniversal.co.id',
        username: 'admin',
        full_name: 'Super Admin',
        address: 'Kantor Pusat TCU',
        password_hash: adminHash,
        twoFactorEnabled: false,
        preferences: { ktp: '3207201611870003' }
      }
    });
  }

  // Link Admin to SUPERADMIN role as well for full access!
  await prisma.userRole.deleteMany({ where: { userId: adminUser.id } }).catch(() => null);
  await prisma.userRole.create({ data: { userId: adminUser.id, roleId: superAdminRole.id } }).catch(() => null);
  await syncEmailAliasToMailDb('admin@topclassuniversal.co.id', 'admin', adminPass);

  console.log('✅ Synchronized all admin accounts successfully!');
  await prisma.$disconnect();
}

syncAllAdmins();
