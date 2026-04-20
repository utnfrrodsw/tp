// Script para crear un usuario administrador
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Usuario, RolUsuario } from '../entities/usuario.entity';

async function createAdminUser() {
  let orm: MikroORM;
  
  try {
    // Inicializar ORM
    orm = await MikroORM.init(config);
    const em = orm.em.fork();

    // Verificar si ya existe un usuario con este email
    const existingUser = await em.findOne(Usuario, { email: 'admin@gmail.com' });
    
    if (existingUser) {
      console.log('❌ Ya existe un usuario con el email admin@gmail.com');
      console.log(`   ID: ${existingUser.id}, Username: ${existingUser.username}, Rol: ${existingUser.rol}`);
      await orm.close();
      return;
    }

    // Crear nuevo usuario administrador
    const adminUser = em.create(Usuario, {
      email: 'admin@gmail.com',
      password: '123456', // Se hasheará automáticamente por el hook @BeforeCreate
      username: 'admin',
      rol: RolUsuario.ADMIN,
      nombre: 'Administrador',
      biografia: 'Usuario administrador del sistema',
      createdAt: new Date(),
    });

    // Guardar en la base de datos
    await em.persistAndFlush(adminUser);

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Rol: ${adminUser.rol}`);
    console.log(`   Contraseña: 123456 (hasheada en BD)`);
    
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    throw error;
  } finally {
    if (orm!) {
      await orm.close();
    }
  }
}

// Ejecutar el script
createAdminUser()
  .then(() => {
    console.log('\n✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en el script:', error);
    process.exit(1);
  });
