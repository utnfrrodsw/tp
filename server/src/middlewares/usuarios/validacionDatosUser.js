const { check, validationResult } = require('express-validator');
const moment = require('moment');

// Middleware para validar la foto de perfil
const validateFotoPerfil = (req, res, next) => {
  if (!req.file || !['image/png', 'image/jpeg', 'image/jpg'].includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'La foto de perfil debe ser en formato PNG o JPEG.' });
  }

  // Middleware de manejo de errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  next();
};

// Middleware de validación para los datos del usuario
const validateUserData = [
  
  // Validación del campo 'nombre'
  check('nombre').optional().notEmpty().withMessage('El nombre es requerido'),

  // Validación del campo 'apellido'
  check('apellido').optional().notEmpty().withMessage('El apellido es requerido'),

  // Validación del campo 'email'
  check('email').optional().isEmail().withMessage('El email debe ser válido'),

  // Validación del campo 'fechaNacimiento'
  check('fechaNacimiento')
    .optional()
    .custom(value => {
      if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD');
      }
      return true;
    })
    .custom(value => {
      const birthDate = moment(value, 'YYYY-MM-DD');
      const currentDate = moment();
      const age = currentDate.diff(birthDate, 'years');
      if (age < 18) {
        throw new Error('Debes ser mayor de 18 años');
      }
      return true;
    }),

  // Middleware de manejo de errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

];

module.exports = { validateUserData,validateFotoPerfil };
