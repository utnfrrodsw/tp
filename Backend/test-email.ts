/**
 * Script de prueba para verificar el envío de emails
 * 
 * Uso:
 * 1. Configura EMAIL_USER y EMAIL_APP_PASSWORD en .env
 * 2. Ejecuta: npx ts-node test-email.ts <tu-email@ejemplo.com> [Tu Nombre]
 * 
 * Ejemplo:
 * npx ts-node test-email.ts juan@gmail.com "Juan Pérez"
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde la raíz PRIMERO
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Importar DESPUÉS de cargar el .env
import { sendNewsletterWelcome } from './src/services/email.service';

async function testEmail() {
  // Obtener argumentos de la línea de comandos
  const email = process.argv[2];
  const nombre = process.argv[3];

  if (!email) {
    console.error('❌ Error: Debes proporcionar un email');
    console.log('\n📖 Uso:');
    console.log('  npx ts-node test-email.ts <email> [nombre]');
    console.log('\n📝 Ejemplo:');
    console.log('  npx ts-node test-email.ts juan@gmail.com "Juan Pérez"');
    process.exit(1);
  }

  // Verificar que las variables de entorno estén configuradas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Error: Variables de entorno no configuradas');
    console.log('\n⚠️  Asegúrate de tener configurado en tu archivo .env:');
    console.log('  EMAIL_USER=tu-email@gmail.com');
    console.log('  EMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion');
    console.log('\n📖 Lee el archivo CONFIGURAR_EMAIL.md para más información');
    process.exit(1);
  }

  console.log('📧 Prueba de envío de email');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📤 Enviando email a: ${email}`);
  if (nombre) {
    console.log(`👤 Nombre: ${nombre}`);
  }
  console.log(`🔐 Email configurado: ${process.env.EMAIL_USER}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('⏳ Enviando email...\n');
    const result = await sendNewsletterWelcome(email, nombre);
    
    console.log('✅ ¡Email enviado exitosamente!');
    console.log(`📨 Message ID: ${result.messageId}`);
    console.log(`📬 Revisa tu bandeja de entrada en: ${email}`);
    console.log('\n💡 Si no lo ves, revisa tu carpeta de SPAM');
    console.log('\n🎉 ¡El sistema de emails está funcionando correctamente!');
    
  } catch (error: any) {
    console.error('\n❌ Error al enviar el email:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📝 Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Error de autenticación');
      console.error('Posibles causas:');
      console.error('  1. La contraseña de aplicación es incorrecta');
      console.error('  2. No tienes activada la verificación en 2 pasos en Gmail');
      console.error('  3. El email configurado es incorrecto');
      console.error('\n📖 Solución: Lee el archivo CONFIGURAR_EMAIL.md');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Error de conexión');
      console.error('Posibles causas:');
      console.error('  1. No tienes conexión a internet');
      console.error('  2. Gmail está bloqueando la conexión');
      console.error('  3. Tu firewall está bloqueando el puerto 587');
    }
    
    console.error('\n🐛 Error completo:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar la prueba
testEmail();
