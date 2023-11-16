const { validationResult, body } = require('express-validator');

// Middleware de validación para el registro de usuario
const validateLogin = [
  body('email').notEmpty().withMessage('El email es requerido'), 
  body ('email').isEmail().withMessage('El email es inválido'),
  body('constrasena').notEmpty().withMessage('La contraseña es requerida'),

  (req, res, next) => {

    // Ejecutar el resto de las validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Exportar el middleware de validación
exports.validateLogin = validateLogin;