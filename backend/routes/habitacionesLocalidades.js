const express = require('express');
const router = express.Router();
const habLocalidadController = require('../controllers/habitacionesLocalidadController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta accesible por clientes
router.get('/', habLocalidadController.obtenerTodasHabitacionesLocalidad);

// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.crearHabitacionLocalidad);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.actualizarHabitacionLocalidad);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.eliminarHabitacionLocalidad);

// Ruta accesible por todos (o según el contexto, si es necesario para los clientes)
router.get('/:idProvincia', habLocalidadController.obtenerHabitacionesPorLocalidad);

module.exports = router;
