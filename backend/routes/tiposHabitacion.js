const express = require('express');
const router = express.Router();
const tipoHabitacionController = require('../controllers/tipoHabitacionController');

router.get('/', tipoHabitacionController.obtenerTodosTipos);
router.get('/:id', tipoHabitacionController.obtenerTipoPorId);
router.post('/', tipoHabitacionController.crearTipo);
router.put('/:id', tipoHabitacionController.actualizarTipo);
router.delete('/:id', tipoHabitacionController.eliminarTipo);

module.exports = router;
