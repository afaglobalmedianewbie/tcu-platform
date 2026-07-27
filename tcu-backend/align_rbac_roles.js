const { prisma } = require('./src/utils/helpers');

async function alignRbacRoles() {
  console.log('🚀 Aligning RBAC Roles, Permissions, and User Assignments...');

  // 1. Define Standard Roles
  const rolesData = [
    { name: 'SUPERADMIN', description: 'Super Admin Utama / CEO (Akses Penuh Seluruh Sistem)' },
    { name: 'ADMIN', description: 'Administrator Sistem & Operasional' },
    { name: 'TEKNISI', description: 'Teknisi Lapangan & Pemeliharaan Jaringan' },
    { name: 'OPERATOR', description: 'Customer Service & Helpdesk Support' },
    { name: 'FINANCE', description: 'Staf Keuangan, Billing & Payment Gateway' },
    { name: 'CUSTOMER', description: 'Pelanggan Layanan Internet FTTH' },
  ];

  const roleMap = {};
  for (const rData of rolesData) {
    let roleObj = await prisma.role.findUnique({ where: { name: rData.name } });
    if (!roleObj) {
      roleObj = await prisma.role.create({ data: rData });
      console.log(`  + Created Role: ${roleObj.name}`);
    } else {
      roleObj = await prisma.role.update({
        where: { id: roleObj.id },
        data: { description: rData.description }
      });
      console.log(`  ~ Updated Role: ${roleObj.name}`);
    }
    roleMap[rData.name] = roleObj;
  }

  // 2. Define Standard Permissions
  const permissionsData = [
    { name: '*', description: 'Hak Akses Penuh (Wildcard)' },
    { name: 'system.manage', description: 'Kelola Sistem, Konfigurasi & SaaS' },
    { name: 'user.manage', description: 'Kelola Pengguna, Akun Mail & Password' },
    { name: 'admin.manage', description: 'Kelola Modul Administrator' },
    { name: 'customer.manage', description: 'Kelola Data Pelanggan & Vouchers' },
    { name: 'customer.read', description: 'Melihat Data Pelanggan' },
    { name: 'finance.manage', description: 'Kelola Keuangan, Transaksi & Invoice' },
    { name: 'finance.read', description: 'Melihat Laporan Keuangan' },
    { name: 'network.manage', description: 'Kelola Jaringan, OLT, Mikrotik & RADIUS' },
    { name: 'network.read', description: 'Melihat Status Jaringan & NOC' },
    { name: 'ticket.manage', description: 'Kelola Tiket Bantuan & Pengaduan' },
    { name: 'ticket.update', description: 'Memperbarui Status Tiket' },
    { name: 'cms.manage', description: 'Kelola Konten Landing Page & Autopost Blog' },
    { name: 'dr.manage', description: 'Disaster Recovery & Backup Database' },
    { name: 'webmail.manage', description: 'Kelola Akun Email & Webmail RBAC' },
    { name: 'technician.workorder', description: 'Kelola Work Order & Tugas Teknisi' },
  ];

  const permMap = {};
  for (const pData of permissionsData) {
    let permObj = await prisma.permission.findUnique({ where: { name: pData.name } });
    if (!permObj) {
      permObj = await prisma.permission.create({ data: pData });
      console.log(`  + Created Permission: ${permObj.name}`);
    }
    permMap[pData.name] = permObj;
  }

  // 3. Link Role Permissions
  const rolePermissionAssignments = {
    SUPERADMIN: ['*', 'system.manage', 'user.manage', 'admin.manage', 'customer.manage', 'finance.manage', 'network.manage', 'ticket.manage', 'cms.manage', 'dr.manage', 'webmail.manage', 'technician.workorder'],
    ADMIN: ['admin.manage', 'user.manage', 'customer.manage', 'finance.manage', 'network.manage', 'ticket.manage', 'cms.manage', 'system.manage', 'webmail.manage'],
    TEKNISI: ['technician.workorder', 'network.read', 'ticket.update'],
    OPERATOR: ['customer.read', 'ticket.manage', 'webmail.manage'],
    FINANCE: ['finance.manage', 'finance.read', 'customer.read'],
    CUSTOMER: ['customer.read']
  };

  for (const [roleName, permList] of Object.entries(rolePermissionAssignments)) {
    const roleObj = roleMap[roleName];
    if (!roleObj) continue;

    for (const permName of permList) {
      const permObj = permMap[permName];
      if (!permObj) continue;

      const existingLink = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId: roleObj.id,
            permissionId: permObj.id
          }
        }
      });

      if (!existingLink) {
        await prisma.rolePermission.create({
          data: {
            roleId: roleObj.id,
            permissionId: permObj.id
          }
        });
      }
    }
    console.log(`  ✓ Synced RolePermissions for ${roleName}`);
  }

  // 4. Align Users to Roles in User & UserRole tables
  const userAssignments = [
    { email: 'ceo@topclassuniversal.co.id', roleName: 'SUPERADMIN' },
    { email: 'admin@topclassuniversal.co.id', roleName: 'ADMIN' },
    { email: 'teknisi@topclassuniversal.co.id', roleName: 'TEKNISI' },
  ];

  for (const uAssign of userAssignments) {
    const userObj = await prisma.user.findFirst({
      where: { email: uAssign.email }
    });

    if (userObj) {
      const roleObj = roleMap[uAssign.roleName];
      if (roleObj) {
        // Link in UserRole junction table
        const existingUserRole = await prisma.userRole.findFirst({
          where: { userId: userObj.id, roleId: roleObj.id }
        });

        if (!existingUserRole) {
          await prisma.userRole.create({
            data: {
              userId: userObj.id,
              roleId: roleObj.id
            }
          });
        }

        console.log(`  ★ User ${userObj.email} successfully aligned with RBAC Role: ${uAssign.roleName}`);
      }
    }
  }

  console.log('\n🎉 ALL RBAC ROLES AND PERMISSIONS FULLY ALIGNED!');
  await prisma.$disconnect();
}

alignRbacRoles().catch(err => {
  console.error('❌ Error aligning RBAC roles:', err);
});
