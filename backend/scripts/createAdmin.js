// Crea el primer usuario admin a partir de ADMIN_EMAIL y ADMIN_PASSWORD del .env.
// Uso: pnpm run create-admin
const sequelize = require('../src/config/database');
const { Usuario } = require('../src/models/associations');
const { validatePassword, hashPassword } = require('../src/utils/password');
const { isValidEmail } = require('../src/utils/http');

const main = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!isValidEmail(email)) throw new Error('ADMIN_EMAIL no está definido o no es un email válido');
  const errorPassword = validatePassword(password);
  if (errorPassword) throw new Error(`ADMIN_PASSWORD: ${errorPassword}`);

  await sequelize.authenticate();
  await sequelize.sync();

  const [usuario, creado] = await Usuario.findOrCreate({
    where: { email: email.trim().toLowerCase() },
    defaults: { passwordHash: await hashPassword(password), rol: 'admin' }
  });

  console.log(
    creado
      ? `Admin creado: ${usuario.email}. Borrá ADMIN_PASSWORD del .env.`
      : `Ya existe un usuario con el email ${usuario.email}; no se modificó.`
  );
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
