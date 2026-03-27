import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function check() {
    console.log("=== Diagnostic Check ===");
    console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
    console.log("JWT_SECRET set:", !!process.env.JWT_SECRET);
    
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@logistics.com' }
        });
        
        if (user) {
            console.log("✅ User admin@logistics.com exists.");
            console.log("User ID:", user.id);
            console.log("User Role:", user.role);
            console.log("Password hash exists:", !!user.password);
        } else {
            console.log("❌ User admin@logistics.com NOT found.");
        }
    } catch (err) {
        console.error("❌ Database connection error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
