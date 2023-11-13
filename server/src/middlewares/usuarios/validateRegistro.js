const { check, validationResult } = require('express-validator');
const moment = require('moment');


// Middleware de validación para el registro de usuario
const validateRegister = [
  // Validación del campo 'nombre'
  check('nombre').notEmpty().withMessage('El nombre es requerido'),

  // Validación del campo 'apellido'
  check('apellido').notEmpty().withMessage('El apellido es requerido'),

  // Validación del campo 'email'
  check('email').isEmail().withMessage('El email debe ser válido'),

  // Validación del campo 'contrasena'
  check('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Validación del campo 'confirmarContrasena'
   

  // Validación del campo 'fechaNacimiento'
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

   
  check('telefono').isMobilePhone().withMessage('El teléfono debe ser un número de teléfono válido'),

   
  check('esPrestador').isBoolean().withMessage('EsPrestador debe ser un valor booleano'),

   
  check('especialidades').isArray().withMessage('Especialidades debe ser un array'),

  //   proporciona al menos un campo
  (req, res, next) => {
    const { nombre, apellido, email, contrasena, fechaNacimiento, telefono, esPrestador, especialidades } = req.body;

    // Verificar si al menos un campo está presente
    if (!nombre && !apellido && !email && !contrasena && !fechaNacimiento && !telefono && esPrestador === undefined && (!especialidades || especialidades.length === 0)) {
      return res.status(400).json({ errors: [{ msg: 'Se debe proporcionar al menos un campo' }] });
    }

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
