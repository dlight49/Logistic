import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createDriver() {
  console.log("=== CREATING DRIVER ACCOUNT (LOCAL AUTH) ===");
  try {
    const email = "radicaforjesus@gmail.com";
    const password = "DriverPassword123!"; // Default password
    const hashedPassword = await bcrypt.hash(password, 12);

    const driver = await prisma.user.upsert({
      where: { email },
      update: {
        role: "operator",
        name: "Favour",
        password: hashedPassword
      },
      create: {
        email,
        name: "Favour",
        role: "operator",
        password: hashedPassword
      }
    });

    console.log("✅ Driver account created/updated successfully!");
    console.log("Name:", driver.name);
    console.log("Email:", driver.email);
    console.log("Role:", driver.role);
    console.log("Default Password:", password);
    console.log("\nNext Step: Favour can now log in at /login with these credentials.");
  } catch (error: any) {
    console.error("❌ Failed to create driver record");
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDriver();
