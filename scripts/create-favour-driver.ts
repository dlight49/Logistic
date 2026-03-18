import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createDriver() {
  console.log("=== CREATING DRIVER ACCOUNT VIA PRISMA ===");
  try {
    // Note: This only creates the database record. 
    // Favour will need to 'Sign Up' with this email on the frontend to create the Firebase Auth record,
    // OR you can create them in Firebase Console manually.
    
    const driver = await prisma.user.upsert({
      where: { email: "radicaforjesus@gmail.com" },
      update: {
        role: "operator",
        name: "Favour"
      },
      create: {
        id: "favour-driver-001", // Placeholder ID until Firebase sync
        email: "radicaforjesus@gmail.com",
        name: "Favour",
        role: "operator"
      }
    });
    
    console.log("✅ Database record for Driver created/updated successfully!");
    console.log("Name:", driver.name);
    console.log("Email:", driver.email);
    console.log("Role:", driver.role);
    console.log("\nNext Step: Favour should register at http://localhost:3000/register with this email.");
  } catch (error: any) {
    console.error("❌ Failed to create driver record");
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDriver();
