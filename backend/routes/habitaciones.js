const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');

router.get('/', habitacionController.obtenerTodasHabitaciones);
router.get('/:id', habitacionController.obtenerHabitacionPorNroHabitacion); // Cambiado a obtenerHabitacionPorNroHabitacion
router.post('/', habitacionController.crearHabitacion);
router.put('/:id', habitacionController.actualizarHabitacion);
router.delete('/:id', habitacionController.eliminarHabitacion);
router.get('/disponibles/:fechaIngreso/:fechaEgreso/:capacidad', habitacionController.obtenerHabitacionesDisponibles);
module.exports = router;
