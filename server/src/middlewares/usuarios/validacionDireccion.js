const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const validateDireccion = [
  body('calle').notEmpty().withMessage('La calle es requerida'),
  body('numero').notEmpty().withMessage('El número es requerido'),
  body('numero').isInt().withMessage('El número debe ser un valor numérico'),
  body('codigoPostal').notEmpty().withMessage('El código postal es requerido'),
  body('codigoPostal').isInt().withMessage('El código postal debe ser un valor numérico'),
  body('ciudad').notEmpty().withMessage('La ciudad es requerida'),
  body('provincia').notEmpty().withMessage('La provincia es requerida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateDireccion };