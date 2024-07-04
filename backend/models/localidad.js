const mongoose = require('mongoose');

const localidadSchema = new mongoose.Schema({
  idLocalidad: { type: Number, required: true },
  nombre: { type: String, required: true },
  idProvincia: { type: String, required: true, ref: 'Provincia' }
});

module.exports = mongoose.model('Localidad', localidadSchema);
