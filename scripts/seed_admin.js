import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
// The user downloaded logistic-dfb9e-firebase-adminsdk-fbsvc-691f8666b0.json
const serviceAccountPath = join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

async function seedData() {
  console.log("Starting master admin seed...");

  try {
    const adminEmail = 'admin@logistics.com';
    const adminPassword = 'AdminPassword123!';
    let adminUid = null;

    try {
      const userRecord = await auth.getUserByEmail(adminEmail);
      adminUid = userRecord.uid;
      console.log(`Successfully fetched user data:  ${userRecord.uid}`);
      await auth.updateUser(adminUid, { password: adminPassword });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User ${adminEmail} not found, creating...`);
        const userRecord = await auth.createUser({
          email: adminEmail,
          emailVerified: true,
          password: adminPassword,
          displayName: 'Master Admin',
          disabled: false,
        });
        adminUid = userRecord.uid;
      } else {
        throw error;
      }
    }

    console.log(`Setting up Firestore document for ${adminEmail} (UID: ${adminUid})...`);

    // Create/update the user document in Firestore to have 'admin' role
    await db.collection('users').doc(adminUid).set({
      email: adminEmail,
      name: 'Master Admin',
      role: 'admin',
      created_at: new Date().toISOString()
    }, { merge: true });

    console.log(`✅ Admin account successfully created and granted permissions!`);
    console.log(`\n--- LOGIN DETAILS ---`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`---------------------\n`);


    // Generate some fake shipments so the dashboard isn't completely empty
    console.log('Seeding demo data...');

    const shipmentsRef = db.collection('shipments');
    const existingShipmentsSnapshot = await shipmentsRef.limit(1).get();

    // Only seed dummy data if the database is completely empty
    if (existingShipmentsSnapshot.empty) {
      console.log('Database looks empty. Adding demo shipments...');
      const dummyShipments = [
        {
          customer_id: adminUid,
          sender_name: 'Acme Corp',
          sender_email: 'shipping@acme.com',
          sender_phone: '555-0101',
          sender_address: '123 Factory Ln',
          sender_city: 'New York',
          sender_country: 'USA',
          receiver_name: 'John Doe',
          receiver_email: 'john@example.com',
          receiver_phone: '555-0102',
          receiver_address: '456 Main St',
          receiver_city: 'London',
          receiver_country: 'UK',
          type: 'Express',
          weight: 4.5,
          dimensions: '10x10x10',
          special_instructions: 'Handle with care',
          price: 125.00,
          status: 'In Transit',
          tracking_number: 'TRK-ACME-001',
          operator_id: null,
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          customer_id: adminUid,
          sender_name: 'TechFlow Solutions',
          sender_email: 'logistics@techflow.io',
          sender_phone: '555-0201',
          sender_address: '88 Innovation Center',
          sender_city: 'San Francisco',
          sender_country: 'USA',
          receiver_name: 'Globex Ltd',
          receiver_email: 'receiving@globex.tld',
          receiver_phone: '555-0202',
          receiver_address: 'Unit 4, Industrial Park',
          receiver_city: 'Berlin',
          receiver_country: 'Germany',
          type: 'Priority',
          weight: 12.0,
          dimensions: '20x20x15',
          special_instructions: 'Requires signature',
          price: 340.50,
          status: 'Held by Customs',
          tracking_number: 'TRK-TECH-002',
          operator_id: null,
          created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          customer_id: adminUid,
          sender_name: 'Global Traders',
          sender_email: 'dispatch@globaltraders.io',
          sender_phone: '555-0301',
          sender_address: 'Warehouse A, Port Road',
          sender_city: 'Singapore',
          sender_country: 'Singapore',
          receiver_name: 'Retail Outlet',
          receiver_email: 'storefront@retail.io',
          receiver_phone: '555-0302',
          receiver_address: 'High Street Mall',
          receiver_city: 'Sydney',
          receiver_country: 'Australia',
          type: 'Standard',
          weight: 45.5,
          dimensions: '40x40x40',
          special_instructions: 'Forklift required',
          price: 850.00,
          status: 'Order Created',
          tracking_number: 'TRK-GLOB-003',
          operator_id: null,
          created_at: new Date().toISOString()
        }
      ];

      for (const shipment of dummyShipments) {
        await shipmentsRef.add(shipment);
      }
      console.log('✅ Demo shipments added.');
    } else {
      console.log('Demo shipments already exist, skipping.');
    }

    console.log("Seed process completed successfully!");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
