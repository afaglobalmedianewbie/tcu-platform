const { prisma, syncEmailAliasToMailDb } = require('./src/utils/helpers');
const bcrypt = require('bcryptjs');

async function createCeoAdmin() {
  const email = 'ceo@topclassuniversal.co.id';
  const username = 'ceo';
  const plainPassword = 'B3j4k3uN@!';
  const roleName = 'SUPERADMIN';
  const full_name = 'Adnan Rachmat';
  const address = 'Padaherang';
  const ktp = '3207201611870003';
  const preferences = { ktp };

  console.log(`🚀 Creating Super Admin account for ${email}...`);

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    // 1. Ensure SUPERADMIN Role exists in Database
    let superAdminRole = await prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: {
          name: roleName,
          description: 'Akses Utama Super Admin Sistem TCU Platform'
        }
      });
      console.log(`✅ Created Role: ${superAdminRole.name} (ID: ${superAdminRole.id})`);
    }

    // 2. Find or Create User in PostgreSQL
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email,
          username,
          full_name,
          address,
          password_hash: hashedPassword,
          preferences
        }
      });
      console.log(`✅ Updated User in PostgreSQL: ${user.email} (ID: ${user.id})`);
    } else {
      user = await prisma.user.create({
        data: {
          email,
          username,
          full_name,
          address,
          password_hash: hashedPassword,
          preferences
        }
      });
      console.log(`✅ Created User in PostgreSQL: ${user.email} (ID: ${user.id})`);
    }

    // 3. Assign SUPERADMIN Role to User in UserRole junction table
    const existingUserRole = await prisma.userRole.findFirst({
      where: { userId: user.id, roleId: superAdminRole.id }
    });

    if (!existingUserRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: superAdminRole.id
        }
      });
      console.log(`✅ Linked User ${user.email} to Role ${superAdminRole.name}`);
    }

    // 4. Sync to Dovecot MySQL Mail Server
    await syncEmailAliasToMailDb(email, username, plainPassword, 'active');
    console.log(`✅ Synced email alias in Dovecot MySQL Mail Server for ${email}`);

    console.log(`\n🎉 SUPER ADMIN ACCOUNT CREATION SUCCESSFUL!`);
    console.log(`--------------------------------------------------`);
    console.log(`Email    : ${email}`);
    console.log(`Username : ${username}`);
    console.log(`Password : ${plainPassword}`);
    console.log(`Role     : ${roleName}`);
    console.log(`Nama     : ${full_name}`);
    console.log(`KTP      : ${ktp}`);
    console.log(`Alamat   : ${address}`);
    console.log(`--------------------------------------------------`);
  } catch (err) {
    console.error(`❌ Error setting up Super Admin account:`, err.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCeoAdmin();
