import { createAuthClient } from '@neondatabase/neon-js/auth';

// Your Neon project endpoint — the base for Neon Auth
const ENDPOINT = "https://ep-floral-sunset-aebbrnxj.c-2.us-east-2.aws.neon.tech";

// Initialize the Auth Client pointing to your specific project's Auth URL
export const authClient = createAuthClient(`${ENDPOINT}/neondb/auth`);
