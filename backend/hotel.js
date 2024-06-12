const express = require('express');
const connectDB = require('./config/db');
const app = express();
const port = 3000;

require('dotenv').config();

if (!process.env.JWT_SECRET) {
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  console.log('JWT_SECRET generado automáticamente:', jwtSecret);

  // Asignar el valor generado a la variable de entorno JWT_SECRET
  process.env.JWT_SECRET = jwtSecret;
}

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const habitacionRoutes = require('./routes/habitaciones');
const tipoHabitacionRoutes = require('./routes/tiposHabitacion');
const clienteRoutes = require('./routes/clientes');
const estadiaRoutes = require('./routes/estadias');
const authRoutes = require('./routes/auth');

// Usar rutas
app.use('/habitaciones', habitacionRoutes);
app.use('/tiposHabitacion', tipoHabitacionRoutes);
app.use('/clientes', clienteRoutes);
app.use('/estadias', estadiaRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
