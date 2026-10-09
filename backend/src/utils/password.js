const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;
const MIN_LENGTH = 8;
// bcrypt solo usa los primeros 72 bytes; más allá los ignora sin avisar
const MAX_BYTES = 72;

// Se compara contra este hash cuando el usuario no existe, para que el tiempo de
// respuesta del login no revele qué emails están registrados
const DUMMY_HASH = bcrypt.hashSync('contraseña-inexistente-para-timing', SALT_ROUNDS);

const validatePassword = (password) => {
  if (typeof password !== 'string') return 'La contraseña es obligatoria';
  if (password.length < MIN_LENGTH)
    return `La contraseña debe tener al menos ${MIN_LENGTH} caracteres`;
  if (Buffer.byteLength(password, 'utf8') > MAX_BYTES) return 'La contraseña es demasiado larga';
  return null;
};

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// Contraseña con la que arranca una cuenta creada por el admin. No pasa por validatePassword
// (hay DNI de 7 dígitos); la cuenta queda con debeCambiarPassword para que el usuario la reemplace
const hashPasswordInicial = (dni) => hashPassword(String(dni));

const verifyPassword = async (password, hash) => {
  const valida = typeof password === 'string' && Buffer.byteLength(password, 'utf8') <= MAX_BYTES;
  const coincide = await bcrypt.compare(valida ? password : '', hash || DUMMY_HASH);
  return valida && Boolean(hash) && coincide;
};

module.exports = { validatePassword, hashPassword, hashPasswordInicial, verifyPassword };
