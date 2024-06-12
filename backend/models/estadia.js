const mongoose = require('mongoose');

const estadiaSchema = new mongoose.Schema({
  idEst: { type: Number, required: true },
  idCli: { type: Number, required: true }, // Agregado idCli
  nroHabitacion: { type: Number, required: true }, // Agregado nroHabitacion
  fechaIngreso: { type: Date, required: true },
  fechaEgreso: { type: Date, required: true },
  estado: { type: String, enum: ['Reservado', 'Activo', 'Cancelado','Finalizado'], required: true }
});



module.exports = mongoose.model('Estadia', estadiaSchema);
