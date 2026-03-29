import { createAuthClient } from '@neondatabase/neon-js/auth';

// Your Neon Auth URL — typically uses the .neonauth. subdomain
const AUTH_URL = "https://ep-floral-sunset-aebbrnxj.neonauth.c-2.us-east-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(AUTH_URL);
