const express = require('express');
const router = express.Router();
const tipoHabitacionController = require('../controllers/tipoHabitacionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas accesibles por todos los usuarios (solo `GET`)
router.get('/', tipoHabitacionController.obtenerTodosTipos);
router.get('/:id', tipoHabitacionController.obtenerTipoPorId);

// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, tipoHabitacionController.crearTipo);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, tipoHabitacionController.actualizarTipo);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, tipoHabitacionController.eliminarTipo);

module.exports = router;
