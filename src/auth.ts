import { createAuthClient } from '@neondatabase/neon-js/auth';

// Use environment variable with fallback to the corrected production URL
const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || "https://ep-floral-sunset-aebbrnxj.us-east-2.aws.neon.build/neondb/auth";

export const authClient = createAuthClient(AUTH_URL);
