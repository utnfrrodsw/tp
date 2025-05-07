import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del JWT
export default {
  secret: process.env.JWT_SECRET || 'tu-clave-secreta',  // La clave secreta para firmar los JWT
  expiresIn: '1h',  // El tiempo de expiración del token, por ejemplo '1h' para 1 hora
};
