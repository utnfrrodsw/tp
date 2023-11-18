const { validationResult, body } = require('express-validator');

const validacionPreCambioClave = [
  body('email').notEmpty().withMessage('El email es requerido'), 
  body ('email').isEmail().withMessage('Ingresa un email válido'),

  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Exportar el middleware de validación
exports.validacionPreCambioClave = validacionPreCambioClave;