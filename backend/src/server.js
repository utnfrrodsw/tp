const app = require('./app');
const sequelize = require('./config/database');
const migrator = require('./config/migrator');
require('./models/associations');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
  await sequelize.authenticate();
  console.log('Conectado a PostgreSQL');
  // Aplica las migraciones pendientes antes de aceptar requests (no usa sequelize.sync)
  await migrator.up();
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
};

iniciar().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  // Código de salida distinto de 0 para que el hosting detecte la falla
  process.exit(1);
});
