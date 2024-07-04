const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');


router.post('/', empleadoController.crearEmpleado);
router.get('/', empleadoController.obtenerTodosEmpleados);
router.get('/:dni', empleadoController.obtenerEmpleadoPorDni);
router.put('/:dni', empleadoController.actualizarEmpleadoPorDni);
router.delete('/:dni', empleadoController.eliminarEmpleadoPorDni);

module.exports = router;
