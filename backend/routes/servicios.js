const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas accesibles por todos los usuarios (solo `GET`)
router.get('/', servicioController.obtenerTodosServicios);
router.get('/:id', servicioController.obtenerServicioPorId);

// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, servicioController.crearServicio);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, servicioController.actualizarServicio);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, servicioController.eliminarServicio);

module.exports = router;
