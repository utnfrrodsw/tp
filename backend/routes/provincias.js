const express = require('express');
const router = express.Router();
const provinciaController = require('../controllers/provinciaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas accesibles por todos los usuarios (solo `GET`)
router.get('/', provinciaController.obtenerTodasProvincias);
router.get('/:id', provinciaController.obtenerProvinciaPorId);

// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, provinciaController.crearProvincia);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, provinciaController.actualizarProvincia);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, provinciaController.eliminarProvincia);

module.exports = router;
