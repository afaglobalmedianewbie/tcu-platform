const { prisma } = require('./src/utils/helpers');

async function disable2FAForAdmins() {
  console.log('🔄 Disabling 2FA for Super Admin & Admin users...');
  
  const updatedCount = await prisma.user.updateMany({
    where: {
      email: {
        in: ['ceo@topclassuniversal.co.id', 'admin@topclassuniversal.co.id', 'teknisi@topclassuniversal.co.id']
      }
    },
    data: {
      twoFactorEnabled: false
    }
  });

  console.log(`✅ Set twoFactorEnabled = false for ${updatedCount.count} admin/staff accounts.`);
  await prisma.$disconnect();
}

disable2FAForAdmins();
