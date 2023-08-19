const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  fecha_reproduccion: { type: Date, default: Date.now },
  canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cancion' }],
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Historial', historialSchema);
