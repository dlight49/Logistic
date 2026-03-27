import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createRootAdmin() {
  const adminEmail = 'fojowuro@gmail.com';
  const adminPassword = 'Glory2005$$';
  const adminName = 'Root Admin';

  console.log(`=== Creating/Updating root admin: ${adminEmail} ===`);

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Prisma (SQLite/Postgres)
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        name: adminName,
        role: 'admin'
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin'
      }
    });

    console.log(`\n✅ ROOT ADMIN ACCOUNT READY!`);
    console.log(`-----------------------------`);
    console.log(`ID:       ${user.id}`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin`);
    console.log(`-----------------------------\n`);

  } catch (error) {
    console.error("❌ Error creating root admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createRootAdmin();
