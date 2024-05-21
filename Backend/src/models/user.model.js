import mongoose from "mongoose";

// Crea un esquema para el usuario
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Por favor ingrese un email válido']
    }
  });

// Crea un modelo basado en el esquema
const User = mongoose.model('User', userSchema);

// Exporta el modelo
module.exports = User;