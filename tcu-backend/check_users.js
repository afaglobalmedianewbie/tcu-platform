const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      username: true,
      full_name: true,
      userRoles: {
        select: {
          role: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  
  const formatted = users.map(u => ({
    id: u.id,
    email: u.email,
    phone: u.phone,
    username: u.username,
    full_name: u.full_name,
    roles: u.userRoles.map(ur => ur.role.name)
  }));
  
  console.log('USERS IN DATABASE:', JSON.stringify(formatted, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
