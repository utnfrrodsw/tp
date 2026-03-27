const { body } = require('express-validator');

exports.validacionModDatosPer = [
  body('nombre').trim().isLength({ min: 1 }).withMessage('Nombre no puede estar vacío'),
  body('apellido').trim().isLength({ min: 1 }).withMessage('Apellido no puede estar vacío'),
  body('email').trim().isEmail().withMessage('Email no es válido'),
  body('fechaNacimiento').optional({ nullable: true }).isISO8601().withMessage('Fecha de nacimiento no es válida'),
];
