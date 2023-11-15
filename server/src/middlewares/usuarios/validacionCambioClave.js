const { check, validationResult } = require('express-validator');

const validarCambioClave = [
  // Validación del campo 'newPassword'
  check('newPassword')
    
    .notEmpty().withMessage('Debes ingresar una contraseña')
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).withMessage('La contraseña debe contener al menos una letra y un número'),

  // Validación del campo 'passwordConfirmation'
  check('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
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

module.exports = { validarCambioClave };