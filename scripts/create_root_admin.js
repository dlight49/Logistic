import { readFileSync } from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const auth = getAuth();
const prisma = new PrismaClient();

async function createRootAdmin() {
  const adminEmail = 'fojowuro@gmail.com';
  const adminPassword = 'Glory2005$$';
  const adminName = 'Root Admin';
  let adminUid = null;

  console.log(`Creating/Updating root admin: ${adminEmail}...`);

  try {
    // 1. Firebase Auth
    try {
      const userRecord = await auth.getUserByEmail(adminEmail);
      adminUid = userRecord.uid;
      console.log(`User found in Firebase Auth (UID: ${adminUid}). Updating password...`);
      await auth.updateUser(adminUid, { 
        password: adminPassword,
        displayName: adminName
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User not found in Firebase Auth. Creating new user...`);
        const userRecord = await auth.createUser({
          email: adminEmail,
          emailVerified: true,
          password: adminPassword,
          displayName: adminName,
          disabled: false,
        });
        adminUid = userRecord.uid;
      } else {
        throw error;
      }
    }

    // 2. Firestore
    console.log(`Syncing Firestore record for UID: ${adminUid}...`);
    await db.collection('users').doc(adminUid).set({
      email: adminEmail,
      name: adminName,
      role: 'admin',
      updated_at: new Date().toISOString()
    }, { merge: true });

    // 3. Prisma (SQLite)
    console.log(`Syncing local Prisma database for ID: ${adminUid}...`);
    await prisma.user.upsert({
      where: { id: adminUid },
      update: {
        email: adminEmail,
        name: adminName,
        role: 'admin'
      },
      create: {
        id: adminUid,
        email: adminEmail,
        name: adminName,
        role: 'admin'
      }
    });

    console.log(`\n✅ ROOT ADMIN ACCOUNT READY!`);
    console.log(`-----------------------------`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin`);
    console.log(`-----------------------------\n`);

  } catch (error) {
    console.error("❌ Error creating root admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createRootAdmin();
