import admin from 'firebase-admin';

// In production, you would use a service account key file path or environment variables:
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// For local development where we might just be using a mock client,
// we try to initialize with whatever default credentials or project ID we have.
const projectId = process.env.FIREBASE_PROJECT_ID || 'mock_project_id';

if (!admin.apps.length) {
    try {
        admin.initializeApp({ projectId });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const firebaseAdmin = admin;
