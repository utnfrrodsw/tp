const mongoose = require('mongoose');

const estadiaServicioSchema = new mongoose.Schema({
  idServicio: { type: Number, required: true },
  idEstadia: { type: Number, required: true }
});

module.exports = mongoose.model('EstadiaServicio', estadiaServicioSchema);
