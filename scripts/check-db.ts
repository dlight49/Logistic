import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function diagnose() {
  console.log("=== DB DIAGNOSTIC START ===");
  console.log("DATABASE_URL check:", process.env.DATABASE_URL ? "FOUND" : "MISSING");
  
  try {
    // 1. Test Connection
    await prisma.$connect();
    console.log("✅ Connection: SUCCESS (Connected to Supabase)");

    // 2. Check Settings (Should have been seeded)
    const settingsCount = await prisma.setting.count();
    console.log(`📊 Settings Count: ${settingsCount}`);
    
    if (settingsCount > 0) {
      const settings = await prisma.setting.findMany({ take: 3 });
      console.log("Sample Settings:", settings.map(s => s.key).join(", "));
    }

    // 3. Check Users
    const userCount = await prisma.user.count();
    console.log(`👤 User Count: ${userCount}`);

    // 4. Check Shipments
    const shipmentCount = await prisma.shipment.count();
    console.log(`📦 Shipment Count: ${shipmentCount}`);

    console.log("=== DIAGNOSTIC COMPLETE ===");
  } catch (error: any) {
    console.error("❌ Connection: FAILED");
    console.error("Error Detail:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
