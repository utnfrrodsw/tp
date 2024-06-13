const mongoose = require('mongoose');

const habitacionSchema = new mongoose.Schema({
  nroHabitacion: {type: Number, required: true},
  idTipo: { type: Number, required: true},
  descripcion: {type: String,required: true},
  estado: {type: String,required: true},
  foto: {type: String },
  capacidadPersonas: {type: Number },
  precioXdia: {type: Number }
});

module.exports = mongoose.model('Habitacion', habitacionSchema);

