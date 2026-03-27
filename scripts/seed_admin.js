import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seedData() {
  console.log("=== Starting Master Admin Seed (Prisma/SQL) ===");

  try {
    const adminEmail = 'admin@logistics.com';
    const adminPassword = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // 1. Create or Update Master Admin
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        name: 'Master Admin',
        role: 'admin',
      },
      create: {
        id: crypto.randomUUID(),
        email: adminEmail,
        password: hashedPassword,
        name: 'Master Admin',
        role: 'admin',
      },
    });

    console.log(`✅ Admin account successfully created/updated: ${admin.id}`);
    console.log(`\n--- LOGIN DETAILS ---`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`---------------------\n`);

    // 2. Seed Demo Shipments if empty
    const shipmentCount = await prisma.shipment.count();
    
    if (shipmentCount === 0) {
      console.log('Database looks empty. Adding demo shipments...');
      
      const dummyShipments = [
        {
          id: 'TRK-ACME-001',
          sender_name: 'Acme Corp',
          sender_city: 'New York',
          sender_country: 'USA',
          sender_address: '123 Factory Ln',
          receiver_name: 'John Doe',
          receiver_email: 'john@example.com',
          receiver_phone: '555-0102',
          receiver_address: '456 Main St',
          receiver_city: 'London',
          receiver_country: 'UK',
          type: 'Express',
          weight: 4.5,
          estimated_cost: 125.00,
          status: 'In Transit',
          created_at: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          id: 'TRK-TECH-002',
          sender_name: 'TechFlow Solutions',
          sender_city: 'San Francisco',
          sender_country: 'USA',
          sender_address: '88 Innovation Center',
          receiver_name: 'Globex Ltd',
          receiver_email: 'receiving@globex.tld',
          receiver_phone: '555-0202',
          receiver_address: 'Unit 4, Industrial Park',
          receiver_city: 'Berlin',
          receiver_country: 'Germany',
          type: 'Priority',
          weight: 12.0,
          estimated_cost: 340.50,
          status: 'Held by Customs',
          created_at: new Date(Date.now() - 172800000), // 2 days ago
        },
        {
          id: 'TRK-GLOB-003',
          sender_name: 'Global Traders',
          sender_city: 'Singapore',
          sender_country: 'Singapore',
          sender_address: 'Warehouse A, Port Road',
          receiver_name: 'Retail Outlet',
          receiver_email: 'storefront@retail.io',
          receiver_phone: '555-0302',
          receiver_address: 'High Street Mall',
          receiver_city: 'Sydney',
          receiver_country: 'Australia',
          type: 'Standard',
          weight: 45.5,
          estimated_cost: 850.00,
          status: 'Order Created',
          created_at: new Date(),
        }
      ];

      for (const shipment of dummyShipments) {
        await prisma.shipment.create({ data: shipment });
      }
      console.log('✅ Demo shipments added.');
    } else {
      console.log('Demo shipments already exist, skipping.');
    }

    console.log("Seed process completed successfully!");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
