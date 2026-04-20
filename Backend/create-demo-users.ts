import { MikroORM } from '@mikro-orm/core';
import { Usuario } from './src/entities/usuario.entity';
import bcrypt from 'bcrypt';
import mikroOrmConfig from './mikro-orm.config';

/**
 * Script para crear usuarios de demostración
 * Requerido para Aprobación Directa DSW
 * 
 * Crea 3 usuarios con diferentes roles:
 * - Usuario normal (demo)
 * - Moderador
 * - Administrador
 * 
 * Uso: npm run create:demo-users
 */

async function createDemoUsers() {
  console.log('🚀 Creando usuarios de demostración...\n');

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    // ========================================
    // Usuario 1: Usuario Normal (Demo)
    // ========================================
    
    const demoUser = em.create(Usuario, {
      nombre: 'Demo',
      apellido: 'Usuario',
      username: 'demo',
      email: 'demo@biblioteca.com',
      password: await bcrypt.hash('Demo123!', 12),
      rol: 'usuario',
      biografia: 'Usuario de demostración para pruebas del sistema. Me encanta leer fantasía y ciencia ficción.',
      ubicacion: 'Buenos Aires, Argentina',
      sitioWeb: 'https://demo.biblioteca.com',
      verificado: true,
    });

    console.log('✅ Usuario Demo creado:');
    console.log('   Email: demo@biblioteca.com');
    console.log('   Password: Demo123!');
    console.log('   Rol: Usuario');
    console.log('');

    // ========================================
    // Usuario 2: Moderador
    // ========================================
    
    const moderador = em.create(Usuario, {
      nombre: 'María',
      apellido: 'Moderadora',
      username: 'moderador',
      email: 'moderador@biblioteca.com',
      password: await bcrypt.hash('Mod123!', 12),
      rol: 'moderador',
      biografia: 'Moderadora del sistema. Me encargo de revisar y aprobar reseñas para mantener la calidad del contenido.',
      ubicacion: 'Córdoba, Argentina',
      verificado: true,
    });

    console.log('✅ Moderador creado:');
    console.log('   Email: moderador@biblioteca.com');
    console.log('   Password: Mod123!');
    console.log('   Rol: Moderador');
    console.log('');

    // ========================================
    // Usuario 3: Administrador
    // ========================================
    
    const admin = em.create(Usuario, {
      nombre: 'Admin',
      apellido: 'Sistema',
      username: 'admin',
      email: 'admin@biblioteca.com',
      password: await bcrypt.hash('Admin123!', 12),
      rol: 'admin',
      biografia: 'Administrador del sistema con acceso completo a todas las funcionalidades.',
      ubicacion: 'Rosario, Argentina',
      verificado: true,
    });

    console.log('✅ Administrador creado:');
    console.log('   Email: admin@biblioteca.com');
    console.log('   Password: Admin123!');
    console.log('   Rol: Administrador');
    console.log('');

    // Guardar en base de datos
    await em.persistAndFlush([demoUser, moderador, admin]);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡Usuarios de demostración creados exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 CREDENCIALES PARA DEMO:');
    console.log('');
    console.log('Usuario Normal:');
    console.log('  📧 Email: demo@biblioteca.com');
    console.log('  🔑 Password: Demo123!');
    console.log('');
    console.log('Moderador:');
    console.log('  📧 Email: moderador@biblioteca.com');
    console.log('  🔑 Password: Mod123!');
    console.log('');
    console.log('Administrador:');
    console.log('  📧 Email: admin@biblioteca.com');
    console.log('  🔑 Password: Admin123!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 Estos usuarios pueden usarse para:');
    console.log('   - Demo en defensa oral');
    console.log('   - Tests E2E automatizados');
    console.log('   - Video explicativo del sistema');
    console.log('   - Validación de funcionalidades por rol');
    console.log('');

  } catch (error: any) {
    console.error('❌ Error al crear usuarios de demostración:');
    console.error(error.message);
    
    // Si los usuarios ya existen, mostrar mensaje amigable
    if (error.code === '23505') { // Unique constraint violation
      console.log('');
      console.log('⚠️  Los usuarios de demostración ya existen en la base de datos.');
      console.log('   Si deseas recrearlos, elimínalos primero o usa diferentes emails.');
    }
    
    process.exit(1);
  } finally {
    await orm.close();
  }
}

// Ejecutar script
createDemoUsers().catch(console.error);
