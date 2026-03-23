import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Initialize Firebase Admin SDK with service account credentials.
 *
 * Resolution order:
 * 1. FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string)
 * 2. firebase-service-account.json in project root
 * 3. Fallback: project-ID-only init (limited — cannot create users)
 */
function getCredential(): admin.credential.Credential | null {
    // Option 1: env var with JSON string
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (envKey && envKey.trim().length > 2) {
        try {
            const parsed = JSON.parse(envKey);
            console.log('[Firebase Admin] Initialized with service account from env var');
            return admin.credential.cert(parsed);
        } catch {
            console.warn('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY is set but not valid JSON');
        }
    }

    // Option 2: JSON file in project root
    // Resolve relative to this file → config/ → backend/ → src/ → project root
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.resolve(__dirname, '..', '..', '..');
    const filePath = path.join(projectRoot, 'firebase-service-account.json');

    console.log(`[Firebase Admin] Checking for service account at: ${filePath}`);

    if (fs.existsSync(filePath)) {
        try {
            const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            console.log(`[Firebase Admin] Found service account for project: ${raw.project_id}`);
            return admin.credential.cert(raw);
        } catch (err) {
            console.error('[Firebase Admin] firebase-service-account.json exists but cannot be parsed:', err);
        }
    } else {
        console.warn('[Firebase Admin] firebase-service-account.json NOT found at expected path');
    }

    return null;
}

if (!admin.apps.length) {
    const credential = getCredential();

    try {
        if (credential) {
            // Let Firebase extract the project ID from the credential automatically
            admin.initializeApp({ credential });
        } else {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            if (!projectId) {
                throw new Error('[Firebase Admin] Critical: No service account found and FIREBASE_PROJECT_ID is not set.');
            }
            console.warn('[Firebase Admin] No service account found — running with Project ID from env');
            admin.initializeApp({ projectId });
        }
    } catch (error) {
        console.error('[Firebase Admin] Initialization error:', error);
    }
}

export const firebaseAdmin = admin;
