const mongoose = require('mongoose');


const habitacionLocalidadSchema = new mongoose.Schema({
  nroHabitacion: { type: Number, required: true },
  idLocalidad: { type: Number, required: true } 
});


module.exports = mongoose.model('HabitacionLocalidad', habitacionLocalidadSchema);
