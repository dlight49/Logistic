import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8VUSEZFHkOjc0Lo9VR6GpuYdWU4KoLvA",
  authDomain: "logistic-dfb9e.firebaseapp.com",
  projectId: "logistic-dfb9e",
  storageBucket: "logistic-dfb9e.firebasestorage.app",
  messagingSenderId: "650613265305",
  appId: "1:650613265305:web:433f264d1f3795edddb908",
  measurementId: "G-G720XN0SR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (optional, with support check)
export const analytics = isSupported().then(supported => supported ? getAnalytics(app) : null);

export default app;
