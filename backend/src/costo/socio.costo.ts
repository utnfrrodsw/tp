import { deportes } from "../deporte/deportes";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// esquema para Socio
const socioSchema = new Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  esEstudiante: { type: Boolean, default: false },
  esMayorDe60: { type: Boolean, default: false },
  deportes: { type: Number, default: 0 }, // Número de deportes que practica
});

//  calcular la cuota mensual
socioSchema.virtual('cuotaMensual').get(function() {
  let cuotaBase = 100; // Cuota base mensual

  //  recargo por número de deportes
  if (socioSchema.deporte === 1) {
    cuotaBase *= 1.10; // 10% si practica 1 deporte
  } else if (socioSchema.deporte > 1) {
    cuotaBase *= 1.20; // mayor si practica más de 1 deporte
  }

 
  if (socioSchema.esEstudiante) {
    cuotaBase *= 0.80; 
    // Descuento del 20% para estudiantes
  }


  if (socioSchema.esMayorDe60) {
    cuotaBase *= 0.50; // Descuento del 50% para mayores de 60 años
  }

  return cuotaBase;
});

// Crear el modelo 'Socio' basado en el esquema
const Socio = mongoose.model('Socio', socioSchema);

module.exports = Socio;
