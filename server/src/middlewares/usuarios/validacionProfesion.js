const { check, validationResult } = require('express-validator');

const validateProfesionesUsuario = [

  // Validación del campo 'profesiones'  
 
  check('profesiones.*').isAlphanumeric().withMessage('La profesion debe ser alfanumérica'),
  check('profesiones.*').notEmpty().withMessage('Cada profesión no puede estar vacía'),
  check('profesiones.*').isLength({ min: 4 }).withMessage('Cada profesión debe tener al menos 4 caracteres'),


  // Middleware de manejo de errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateProfesionesUsuario };