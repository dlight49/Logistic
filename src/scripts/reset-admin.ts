import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('🚀 Starting Admin Account Reset...');
  try {
    const email = 'admin@logistics.com';
    const password = 'AdminPassword123!';
    
    // 1. Delete existing admin if any
    await prisma.user.deleteMany({
      where: { email: email }
    });
    
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 3. Create new admin
    const admin = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email: email,
        password: hashedPassword,
        name: 'System Admin',
        role: 'admin'
      }
    });
    
    console.log('✅ DATABASE RESET SUCCESSFUL');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
  } catch (error) {
    console.error('❌ Failed to reset admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
