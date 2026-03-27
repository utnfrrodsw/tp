
const { body } = require('express-validator');

exports.verificarClave = [
  body('claveActual')
    .trim()
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
];
