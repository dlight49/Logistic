import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
const app = initializeApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
// Simple prisma-like wrapper if needed for minimal changes, 
// but we'll mostly refactor to use standard Firestore patterns.
export const prisma = {
// This is a placeholder to prevent immediate build errors 
// while we refactor the controllers.
};
//# sourceMappingURL=db.js.map