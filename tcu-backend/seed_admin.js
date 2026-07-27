const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@topclassuniversal.co.id';
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: { 
        password_hash: hashedPassword,
        full_name: 'Super Admin'
      }
    });
    console.log(`Updated existing user ${email} with password: ${password}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: 'ADMIN',
        full_name: 'Super Admin'
      }
    });
    console.log(`Created new user ${email} with password: ${password}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
