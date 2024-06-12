const mongoose = require('mongoose');

const tipoHabitacionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  denominacion: { type: String, required: true }
});

module.exports = mongoose.model('TipoHabitacion', tipoHabitacionSchema);
