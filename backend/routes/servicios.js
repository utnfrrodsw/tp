const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Rutas para servicios
router.get('/', servicioController.obtenerTodosServicios);
router.get('/:id', servicioController.obtenerServicioPorId);
router.post('/', servicioController.crearServicio);
router.put('/:id', servicioController.actualizarServicio);
router.delete('/:id', servicioController.eliminarServicio);

module.exports = router;
