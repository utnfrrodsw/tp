
const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socio.controller');

// Rutas
router.get('/socios', socioController.obtenerSocios);
router.get('/socios/:id', socioController.obtenerSocioPorId);
router.post('/socios', socioController.crearSocio);
router.put('/socios/:id', socioController.actualizarSocio);
router.delete('/socios/:id', socioController.eliminarSocio);

module.exports = router;
