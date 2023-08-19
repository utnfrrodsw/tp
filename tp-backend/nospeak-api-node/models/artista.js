const mongoose = require('mongoose');

const artistaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  nro_seguidores: { type: Number, required: true },
});

module.exports = mongoose.model('Artista', artistaSchema);
