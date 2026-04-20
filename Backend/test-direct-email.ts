import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function testDirectEmail() {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

  console.log('🔍 Configuración:');
  console.log('User:', EMAIL_USER);
  console.log('Pass:', EMAIL_APP_PASSWORD);
  console.log('Pass length:', EMAIL_APP_PASSWORD?.length);
  
  console.log('\n📧 Intentando enviar email...\n');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD,
    },
    debug: true, // Ver logs detallados
    logger: true, // Ver logs
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa!\n');

    // Enviar email de prueba
    const info = await transporter.sendMail({
      from: `BookCode <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: 'Test Newsletter - BookCode',
      html: '<h1>✅ Email funcionando!</h1><p>El sistema de newsletter está configurado correctamente.</p>',
      text: 'Email funcionando! El sistema de newsletter está configurado correctamente.'
    });

    console.log('✅ Email enviado exitosamente!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 Newsletter funcional! Revisa tu bandeja de entrada.');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Detalles completos:', error);
  }
}

testDirectEmail();
