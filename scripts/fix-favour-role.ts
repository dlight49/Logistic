import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function fixFavourRole() {
  console.log("=== CHECKING AND FIXING FAVOUR'S ROLE ===");
  try {
    const user = await prisma.user.findFirst({
      where: { email: "radicaforjesus@gmail.com" }
    });

    if (!user) {
      console.log("❌ Favour not found in database.");
      return;
    }

    console.log("Current Record:", user);

    if (user.role !== 'operator') {
      console.log("Updating role to 'operator' (Driver)...");
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'operator' }
      });
      console.log("✅ Role updated successfully:", updated.role);
    } else {
      console.log("✅ Favour already has the 'operator' (Driver) role.");
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixFavourRole();
