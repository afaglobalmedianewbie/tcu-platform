const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://tcu_staging_user:staging_super_secret_password_123@127.0.0.1:55432/tcu_platform_staging"
    }
  }
});

async function main() {
  try {
    await prisma.$connect();
    const tableCount = await prisma.user.count();
    console.log("SUCCESS: Prisma Client connected to staging successfully. User table accessible, count:", tableCount);
  } catch (error) {
    console.error("FAILED to connect:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
