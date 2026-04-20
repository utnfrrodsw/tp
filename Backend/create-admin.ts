import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '..', '.env') });

import ormConfig from './src/mikro-orm.config';
import { MikroORM } from '@mikro-orm/mysql';
import { Usuario, RolUsuario } from './src/entities/usuario.entity';

/**
 * Script para crear los usuarios necesarios para el sistema:
 * - Administrador
 * - Moderador
 * - Usuario normal (para tests E2E)
 *
 * Uso: npx ts-node create-admin.ts
 */

const usersToCreate = [
  {
    email: 'admin@gmail.com',
    password: '123456',
    username: 'admin',
    rol: RolUsuario.ADMIN,
    nombre: 'Administrador',
  },
  {
    email: 'moderador@biblioteca.com',
    password: 'Mod123!',
    username: 'moderador',
    rol: 'moderador' as RolUsuario,
    nombre: 'María Moderadora',
  },
  {
    email: 'demo@biblioteca.com',
    password: 'Demo123!',
    username: 'demo',
    rol: RolUsuario.USUARIO,
    nombre: 'Demo Usuario',
    biografia: 'Usuario de demostración para pruebas del sistema.',
  },
];

(async () => {
  const orm = await MikroORM.init(ormConfig);
  const em = orm.em.fork();

  try {
    console.log('🚀 Creando usuarios del sistema...\n');

    for (const userData of usersToCreate) {
      const existing = await em.findOne(Usuario, { email: userData.email });
      if (existing) {
        console.log(`⚠️  ${userData.email} ya existe, se omite.`);
        continue;
      }

      const user = em.create(Usuario, {
        email: userData.email,
        password: userData.password, // Se hashea automáticamente por el hook @BeforeCreate
        username: userData.username,
        rol: userData.rol,
        nombre: userData.nombre,
        biografia: userData.biografia,
        createdAt: new Date(),
      });

      await em.persistAndFlush(user);
      console.log(`✅ ${userData.nombre} creado (${userData.email})`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡Usuarios creados exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 CREDENCIALES:');
    console.log('');
    console.log('  Administrador:');
    console.log('    📧 admin@gmail.com / 🔑 123456');
    console.log('');
    console.log('  Moderador:');
    console.log('    📧 moderador@biblioteca.com / 🔑 Mod123!');
    console.log('');
    console.log('  Usuario (E2E tests):');
    console.log('    📧 demo@biblioteca.com / 🔑 Demo123!');
    console.log('');
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  } finally {
    await orm.close();
  }
})().catch(console.error);
