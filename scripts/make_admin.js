import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin with Application Default Credentials
// WARNING: This requires you to have GOOGLE_APPLICATION_CREDENTIALS set on your machine,
// OR we can use the service account key directly if you have it downloaded.

async function makeUserAdmin(email) {
    try {
        console.log(`Looking up user with email: ${email}`);
        // For development, if we don't have the service account key securely configured, 
        // the easiest way for the user is to give them instructions on how to do it manually in the console,
        // or provide a secure script they run locally after downloading their key.
        console.log("To run this automatically, we need a serviceAccountKey.json.");
    } catch (e) {
        console.error("Error", e);
    }
}

makeUserAdmin('live.test@logistics.com');
