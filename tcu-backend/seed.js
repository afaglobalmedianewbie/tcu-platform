const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus data lama...');
  await prisma.radReply.deleteMany({});
  await prisma.radCheck.deleteMany({});
  await prisma.radUserGroup.deleteMany({});
  await prisma.workOrder.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Membuat data dummy (Seeding)...');
  
  const hash = await bcrypt.hash('admin123', 10);
  
  // 1. Buat User Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@topclassuniversal.co.id',
      phone: '081200000001',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  console.log(`✅ Admin terbuat: ${admin.email}`);

  // 2. Buat User Teknisi
  const teknisi = await prisma.user.create({
    data: {
      email: 'teknisi@topclassuniversal.co.id',
      phone: '081200000002',
      password_hash: hash,
      role: 'TECHNICIAN'
    }
  });
  console.log(`✅ Teknisi terbuat: ${teknisi.email}`);

  // 3. Buat Subscription Plans
  const plan1 = await prisma.subscriptionPlan.create({
    data: { name: 'Starter 20 Mbps', speed_mbps: 20, price: 200000, mikrotik_profile: 'profile-20m' }
  });
  const plan2 = await prisma.subscriptionPlan.create({
    data: { name: 'Popular 50 Mbps', speed_mbps: 50, price: 350000, mikrotik_profile: 'profile-50m' }
  });
  console.log(`✅ Paket langganan terbuat.`);

  // 4. Buat User Customer
  const custUser1 = await prisma.user.create({
    data: {
      email: 'budi@gmail.com',
      phone: '081300000011',
      password_hash: hash,
      role: 'CUSTOMER'
    }
  });
  const custProfile1 = await prisma.customerProfile.create({
    data: {
      userId: custUser1.id,
      customer_id_string: 'CUST-001',
      full_name: 'Budi Santoso',
      address: 'Jl. Merdeka No 1',
      status: 'ACTIVE',
      planId: plan1.id,
      mikrotik_ip: '10.0.0.10'
    }
  });

  // 5. Masukkan ke RADIUS Tables (Budi)
  await prisma.radCheck.create({ data: { username: 'CUST-001@topclassuniversal.co.id', attribute: 'Cleartext-Password', op: '==', value: 'admin123' }});
  await prisma.radReply.create({ data: { username: 'CUST-001@topclassuniversal.co.id', attribute: 'Framed-IP-Address', op: '=', value: '10.0.0.10' }});
  await prisma.radUserGroup.create({ data: { username: 'CUST-001@topclassuniversal.co.id', groupname: 'profile-20m', priority: 1 }});

  // 6. Buat Invoices
  await prisma.invoice.create({
    data: {
      id: 'INV-2607-001',
      customerId: custProfile1.id,
      period: 'Juli 2026',
      amount: plan1.price,
      due_date: new Date(new Date().setDate(new Date().getDate() + 3)),
      status: 'UNPAID'
    }
  });

  // 7. Buat Tickets & WorkOrder
  const tkt = await prisma.ticket.create({
    data: {
      id: 'TKT-1001',
      customerId: custProfile1.id,
      subject: 'Internet Putus (LOS Merah)',
      description: 'Lampu modem LOS berkedip merah sejak pagi.',
      priority: 'HIGH',
      status: 'OPEN'
    }
  });
  await prisma.workOrder.create({
    data: {
      id: 'WO-1001',
      technicianId: teknisi.id,
      ticketId: tkt.id,
      customerId: custProfile1.id,
      task_type: 'REPAIR',
      status: 'PENDING',
      scheduled: new Date()
    }
  });

  console.log(`✅ Dummy data pelanggan dan teknisi lengkap disuntikkan.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
