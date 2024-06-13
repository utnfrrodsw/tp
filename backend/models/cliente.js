const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  
  idCli: {type: Number,required: true},
  nroDni: {type: Number, required: true},
  tipoDni: {type: String,required: true},
  apellidoYnombre: {type: String,required: true},
  sexo: {type: String,required: true},
  fechaNac: {type: Date,required: true},
  email: {type: String,required: true},
  contrasena: {type: String,required: true}

});

module.exports = mongoose.model('Cliente', clienteSchema);


