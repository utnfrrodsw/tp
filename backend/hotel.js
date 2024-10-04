const express = require('express');
const connectDB = require('./config/db');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

require('dotenv').config();

if (!process.env.JWT_SECRET) {
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('hex'); 
  process.env.JWT_SECRET = jwtSecret;
}


connectDB();


app.use(express.json());


const habitacionRoutes = require('./routes/habitaciones');
const tipoHabitacionRoutes = require('./routes/tiposHabitacion');
const clienteRoutes = require('./routes/clientes');
const estadiaRoutes = require('./routes/estadias');
const authRoutes = require('./routes/auth');
const servicioRoutes = require('./routes/servicios');
const estadiaServicioRoutes = require('./routes/estadiaServicios');
const provinciaRoutes=require('./routes/provincias');
const localidadRoutes=require('./routes/localidades');
const habitacionesLocalidadesRoutes=require('./routes/habitacionesLocalidades');
const empleadoRoutes=require('./routes/empleados');

app.use('/habitaciones', habitacionRoutes);
app.use('/tiposHabitacion', tipoHabitacionRoutes);
app.use('/clientes', clienteRoutes);
app.use('/estadias', estadiaRoutes);
app.use('/auth', authRoutes);
app.use('/servicios', servicioRoutes);
app.use('/estadiaServicio', estadiaServicioRoutes);
app.use('/provincias', provinciaRoutes);
app.use('/localidades', localidadRoutes);
app.use('/habitacionesLocalidad', habitacionesLocalidadesRoutes); 
app.use('/empleados',empleadoRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
