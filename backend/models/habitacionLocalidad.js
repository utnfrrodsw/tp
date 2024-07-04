const mongoose = require('mongoose');

const habitacionLocalidadSchema = new mongoose.Schema({
  nroHabitacion: { type: Number, required: true },
  idProvincia: { type: String, required: true }
});

module.exports = mongoose.model('HabitacionLocalidad', habitacionLocalidadSchema);

