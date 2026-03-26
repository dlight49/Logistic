import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- NEON DATABASE SMOKE TEST ---');
  try {
    // 1. Connection check
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connection established.');

    // 2. Schema check
    console.log('Checking tables...');
    const userCount = await prisma.user.count();
    console.log(`✅ Table "User" is accessible. Count: ${userCount}`);

    const shipmentCount = await prisma.shipment.count();
    console.log(`✅ Table "Shipment" is accessible. Count: ${shipmentCount}`);

    console.log('--- ALL TABLES SYNCED AND ACCESSIBLE ---');
  } catch (e) {
    console.error('❌ SMOKE TEST FAILED:');
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
