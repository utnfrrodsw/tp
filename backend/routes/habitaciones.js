const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', habitacionController.obtenerTodasHabitaciones);
router.get('/:id', habitacionController.obtenerHabitacionPorNroHabitacion);
router.get('/disponibles/:fechaIngreso/:fechaEgreso/:capacidad/:idLoc', habitacionController.obtenerHabitacionesDisponibles);

// Rutas protegidas para empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, habitacionController.crearHabitacion);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, habitacionController.actualizarHabitacion);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, habitacionController.eliminarHabitacion);

module.exports = router;

