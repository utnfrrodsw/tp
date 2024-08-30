const mongoose = require('mongoose');

// Definir el esquema de HabitacionLocalidad con idLocalidad en lugar de idProvincia
const habitacionLocalidadSchema = new mongoose.Schema({
  nroHabitacion: { type: Number, required: true },
  idLocalidad: { type: Number, required: true } // Cambiado a idLocalidad
});

// Exportar el modelo HabitacionLocalidad
module.exports = mongoose.model('HabitacionLocalidad', habitacionLocalidadSchema);
