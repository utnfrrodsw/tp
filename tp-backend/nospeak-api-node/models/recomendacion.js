const mongoose = require('mongoose');

const recomendacionSchema = new mongoose.Schema({
  fecha_recomendacion: { type: Date, default: Date.now },
  canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cancion' }],
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Recomendacion', recomendacionSchema);
