const app = require('./app');
const sequelize = require('./config/database');
require('./models/associations'); // define las relaciones N:M

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error de conexión:', err));
