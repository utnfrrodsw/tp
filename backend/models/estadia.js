const mongoose = require('mongoose');

const estadiaSchema = new mongoose.Schema({
  idEst: { type: Number, required: true },
  idCli: { type: Number, required: true },
  nroHabitacion: { type: Number, required: true },
  fechaIngreso: { type: Date, required: true },
  fechaEgreso: { type: Date, required: true },
  estado: { type: String, enum: ['Reservado', 'Activo', 'Cancelado', 'Finalizado'], required: true },
  idLocalidad: { type: Number, required: true } 
});




module.exports = mongoose.model('Estadia', estadiaSchema);
