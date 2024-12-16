const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  idServ: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true }
});



module.exports = mongoose.model('Servicio', servicioSchema);
