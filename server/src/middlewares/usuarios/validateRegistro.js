const { check, validationResult, body } = require('express-validator');
const moment = require('moment');


// Middleware de validación para el registro de usuario
const validateRegister = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('email').notEmpty().withMessage('El email es requerido'), 
  body('contrasena')
  .notEmpty().withMessage('La contraseña es requerida')
  .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
  .matches(/[a-zA-Z]/).withMessage('La contraseña debe contener al menos una letra'),
  body ('confirmContrasena').notEmpty().withMessage('Confirma tu contraseña'),
  body('telefono').notEmpty().withMessage('El teléfono es requerido'),
  body('fechaNacimiento').notEmpty().withMessage('La fecha de nacimiento es requerida'),
  body('email').isEmail().withMessage('El email es inválido'),
  body('telefono').isNumeric().withMessage('El teléfono debe ser un número'),
  body('telefono').isLength({ min: 9, max:9}).withMessage('El teléfono debe 9 dígitos '),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmContrasena').custom((value, { req }) => {
    if (value !== req.body.contrasena) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  check('fechaNacimiento')
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

  //   proporciona al menos un campo
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
exports.validateRegister = validateRegister;
