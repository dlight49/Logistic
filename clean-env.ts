import fs from 'fs';
import dotenv from 'dotenv';
const env = dotenv.config().parsed;
if (env) {
  let content = '';
  for (const [key, value] of Object.entries(env)) {
    content += `${key}=${value}\n`;
  }
  fs.writeFileSync('.env', content, 'utf8');
  console.log('Rewrote .env successfully');
}
