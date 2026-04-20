/**
 * Script de diagnóstico para verificar la configuración de email
 */
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno desde la raíz
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || '❌ NO CONFIGURADO');
console.log('🔐 EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 
  `✅ Configurado (${process.env.EMAIL_APP_PASSWORD.length} caracteres)` : 
  '❌ NO CONFIGURADO');
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL || '❌ NO CONFIGURADO');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  console.log('❌ FALTAN CREDENCIALES\n');
  console.log('📖 CÓMO CONFIGURAR GMAIL:\n');
  console.log('1️⃣  Ve a tu cuenta de Gmail: bookcode.tpdsw@gmail.com');
  console.log('2️⃣  Ve a: https://myaccount.google.com/security');
  console.log('3️⃣  Busca "Verificación en 2 pasos" y actívala');
  console.log('4️⃣  Luego busca "Contraseñas de aplicaciones"');
  console.log('5️⃣  Crea una nueva contraseña para "BookCode"');
  console.log('6️⃣  Gmail te dará 16 caracteres: aaaa bbbb cccc dddd');
  console.log('7️⃣  Cópialos SIN ESPACIOS en el .env: aaaabbbbccccdddd\n');
  console.log('📝 Ejemplo en .env:');
  console.log('   EMAIL_USER=bookcode.tpdsw@gmail.com');
  console.log('   EMAIL_APP_PASSWORD=aaaabbbbccccdddd\n');
  process.exit(1);
} else {
  console.log('✅ Variables configuradas correctamente\n');
  console.log('⚠️  Si sigue fallando, la contraseña de aplicación puede ser incorrecta.');
  console.log('   Genera una nueva en: https://myaccount.google.com/apppasswords\n');
}
