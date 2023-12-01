const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cancion' }],
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  portada: { type: String, required: false },
});

module.exports = mongoose.model('Playlist', playlistSchema);
