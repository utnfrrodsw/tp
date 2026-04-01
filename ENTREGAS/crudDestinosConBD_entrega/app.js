// corre en puerto 3001
//cd backendTP\crudDestinosConBD
const express = require('express');
const destinosRoutes = require('./src/routes/destinos.routes');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/api/destinos', destinosRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
const sequelize = require('./src/config/database');
const Destino = require('./src/models/destino.model');

sequelize.sync()
  .then(() => {
    console.log('Base de datos y tablas listas');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });