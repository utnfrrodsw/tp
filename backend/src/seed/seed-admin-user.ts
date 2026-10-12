// Crea el usuario ADMIN inicial.
//
// Hace falta para poder entrar al sistema la primera vez: el circuito de moderación
// del catálogo (aprobar lo que aporta un usuario PRO) exige un ADMIN, y no hay
// forma de que se cree solo desde el registro público, que siempre da de alta FREE.
//
// Uso:  npm run seed:admin     (o `npm run seed`, que corre todos los seeds)
//
// La contraseña se guarda hasheada con bcrypt, igual que hará el registro de usuarios
// en la Fase 3: nunca se escribe en texto plano en la base.
import bcrypt from 'bcryptjs';
import { env } from '../shared/config/env';
import { sequelize } from '../shared/db/sequelize';
import { User } from '../entities';

// Costo del hash de bcrypt. 10 es el valor habitual: suficientemente lento como para
// que no se pueda atacar por fuerza bruta, sin trabar el login.
const SALT_ROUNDS = 10;

/**
 * Crea el usuario administrador si todavía no existe.
 *
 * Es idempotente y además conservador: si ya hay un usuario con ese email, NO lo pisa.
 * Si lo sobrescribiera, cada corrida del seed le devolvería la contraseña por defecto
 * a una cuenta cuya contraseña quizás ya se cambió.
 */
export async function seedAdminUser(): Promise<void> {
  const { username, email, password } = env.seedAdmin;

  // La contraseña por defecto está escrita en el repo: sirve para desarrollar,
  // pero en producción dejaría un ADMIN con una clave que conoce cualquiera.
  if (env.isProduction && !process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('En producción hay que definir SEED_ADMIN_PASSWORD en el .env antes de crear el admin.');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log(`[seed] El usuario admin ya existe, se omite: ${email}`);
    return;
  }

  await User.create({
    username,
    email,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    rol: 'ADMIN',
  });

  console.log(`[seed] Usuario ADMIN creado: ${email} (usuario: ${username})`);
  console.log('[seed] La contraseña es la de SEED_ADMIN_PASSWORD en el .env.');
}

// Permite correr solo este seed, sin tocar los demás.
if (require.main === module) {
  void (async () => {
    try {
      await sequelize.authenticate();
      console.log('[seed] Conectado a la base de datos.');
      await seedAdminUser();
      await sequelize.close();
    } catch (error) {
      console.error('[seed] Falló la creación del usuario admin:');
      console.error(error);
      process.exit(1);
    }
  })();
}
