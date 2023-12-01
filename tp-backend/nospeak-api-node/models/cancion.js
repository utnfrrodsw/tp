const mongoose = require('mongoose');

const cancionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  anio_lanzamiento: { type: Number, required: true },
  genero: { type: String, required: true },
  duracion: { type: Number, required: true },
  audio: { type: String, required: true },
  spotify_id: { type: String, required: true },
  artista: { type: mongoose.Schema.Types.ObjectId, ref: 'Artista' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
});

module.exports = mongoose.model('Cancion', cancionSchema);
