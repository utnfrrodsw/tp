const express = require('express');
const router = express.Router();
const habLocalidadController = require('../controllers/habitacionesLocalidadController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', habLocalidadController.obtenerTodasHabitacionesLocalidad);

router.post('/',authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.crearHabitacionLocalidad);
router.put('/:id',authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.actualizarHabitacionLocalidad);
router.delete('/:id',authMiddleware.verificarAutenticacionEmpleado, habLocalidadController.eliminarHabitacionLocalidad);


router.get('/:idLocalidad', habLocalidadController.obtenerHabitacionesPorLocalidad);

module.exports = router;

