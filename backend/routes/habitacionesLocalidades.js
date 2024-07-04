const express = require('express');
const router = express.Router();
const habLocalidadController = require('../controllers/habitacionesLocalidadController');


router.post('/', habLocalidadController.crearHabitacionLocalidad);
router.get('/', habLocalidadController.obtenerTodasHabitacionesLocalidad);
router.put('/:id', habLocalidadController.actualizarHabitacionLocalidad);
router.delete('/:id', habLocalidadController.eliminarHabitacionLocalidad);
router.get('/:idProvincia', habLocalidadController.obtenerHabitacionesPorLocalidad);
module.exports = router;
