require('dotenv').config();

const express = require('express');
const conectar = require('./config/db');
const app = express();
const port = process.env.PORT;
const cors = require('cors');

app.use(cors());


conectar();


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
