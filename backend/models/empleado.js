const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  idEmpleado: { type: Number, required: true, unique: true },
  tipoActividad: { type: String, required: true },
  apellidoYnombre: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
  mail: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true }
});

module.exports = mongoose.model('Empleado', empleadoSchema);
