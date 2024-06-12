const express = require('express');
const connectDB = require('./config/db');
const app = express();
const port = 3000;

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const habitacionRoutes = require('./routes/habitaciones');
const tipoHabitacionRoutes = require('./routes/tiposHabitacion');

// Usar rutas
app.use('/habitaciones', habitacionRoutes);
app.use('/tiposHabitacion', tipoHabitacionRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
