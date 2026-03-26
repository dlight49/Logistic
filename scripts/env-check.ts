import dotenv from 'dotenv';
dotenv.config({ override: true });

console.log("DATABASE_URL found:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL length:", process.env.DATABASE_URL.length);
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL.substring(0, 10));
}
