import dotenv from 'dotenv';
const result = dotenv.config({ override: true });
console.log('Result:', result.error ? result.error : 'SUCCESS');
if (result.parsed) {
  console.log('Keys found in .env:', Object.keys(result.parsed));
}
console.log('DIRECT_URL is', process.env.DIRECT_URL ? 'PRESENT' : 'MISSING');
console.log('DIRECT_URL length:', process.env.DIRECT_URL?.length);
