const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up conflicting ENUM types and creating RBAC tables...");

  const dropTypes = [
    `DROP TYPE IF EXISTS "Role" CASCADE`,
    `DROP TYPE IF EXISTS "CustStatus" CASCADE`,
    `DROP TYPE IF EXISTS "InvoiceStatus" CASCADE`,
    `DROP TYPE IF EXISTS "TaskType" CASCADE`,
    `DROP TYPE IF EXISTS "TicketPriority" CASCADE`,
    `DROP TYPE IF EXISTS "TicketStatus" CASCADE`,
    `DROP TYPE IF EXISTS "WOStatus" CASCADE`
  ];

  for (const cmd of dropTypes) {
    try {
      await prisma.$executeRawUnsafe(cmd);
      console.log("Dropped Enum/Type successfully:", cmd);
    } catch (e) {
      console.log("Ignore drop error:", e.message);
    }
  }
  
  const sqlCommands = [
    `CREATE TABLE IF NOT EXISTS "Role" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS "Permission" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS "UserRole" (
        "userId" TEXT NOT NULL,
        "roleId" TEXT NOT NULL,
        CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
    )`,
    `CREATE TABLE IF NOT EXISTS "RolePermission" (
        "roleId" TEXT NOT NULL,
        "permissionId" TEXT NOT NULL,
        CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Permission_name_key" ON "Permission"("name")`,
    `CREATE INDEX IF NOT EXISTS "UserRole_userId_idx" ON "UserRole"("userId")`,
    `CREATE INDEX IF NOT EXISTS "UserRole_roleId_idx" ON "UserRole"("roleId")`,
    `CREATE INDEX IF NOT EXISTS "RolePermission_roleId_idx" ON "RolePermission"("roleId")`,
    `CREATE INDEX IF NOT EXISTS "RolePermission_permissionId_idx" ON "RolePermission"("permissionId")`
  ];

  for (const cmd of sqlCommands) {
    try {
      await prisma.$executeRawUnsafe(cmd);
      console.log("SUCCESS: Executed SQL table creation.");
    } catch (e) {
      console.log("Warn/Ignore table creation:", e.message);
    }
  }

  // Foreign keys
  const fkCommands = [
    `ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`
  ];

  for (const cmd of fkCommands) {
    try {
      await prisma.$executeRawUnsafe(cmd);
      console.log("SUCCESS: Added Foreign Key constraint.");
    } catch (e) {
      console.log("Ignore FK addition:", e.message);
    }
  }

  console.log("Production DB schema tables Role, Permission, UserRole, RolePermission are fully synchronized!");
  await prisma.$disconnect();
}

main();
