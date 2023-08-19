const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  portada: { type: String, required: true },
});

module.exports = mongoose.model('Album', albumSchema);
