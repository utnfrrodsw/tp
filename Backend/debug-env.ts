import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

console.log('=== DEBUG ENV ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD);
console.log('Longitud:', process.env.EMAIL_APP_PASSWORD?.length);
console.log('Tipo:', typeof process.env.EMAIL_APP_PASSWORD);
