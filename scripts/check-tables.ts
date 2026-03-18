import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkTables() {
  console.log("=== CHECKING DATABASE TABLES ===");
  try {
    // Check for 'User' table (Prisma default)
    const users = await prisma.user.findMany({ take: 1 });
    console.log("✅ 'User' table exists and is accessible via Prisma.");
    
    // Check for 'profiles' table via raw query
    try {
      const profiles = await prisma.$queryRawUnsafe('SELECT * FROM "profiles" LIMIT 1');
      console.log("✅ 'profiles' table exists.");
    } catch (e) {
      console.log("❌ 'profiles' table NOT found (or not in public schema).");
    }

    const favour = await prisma.user.findFirst({
      where: { email: "radicaforjesus@gmail.com" }
    });
    console.log("Favour's record in 'User' table:", favour);

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
