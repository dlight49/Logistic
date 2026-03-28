import { createAuthClient } from '@neondatabase/neon-js/auth';

// Use environment variable with fallback to the confirmed production URL
// The .tech suffix matches the provisioned Data API for this project
const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || "https://ep-floral-sunset-aebbrnxj.neonauth.us-east-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(AUTH_URL);
