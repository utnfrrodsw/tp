const app = require('./app');
const sequelize = require('./config/database');
require('./models/associations'); // define las relaciones N:M antes de sincronizar

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL');
    return sequelize.sync(); // crea tablas si no existen
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error de conexión:', err));
