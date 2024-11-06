const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const authMiddleware = require('../middlewares/authMiddleware');




router.post('/', empleadoController.crearEmpleado);
router.get('/', authMiddleware.verificarAutenticacionEmpleado, empleadoController.obtenerTodosEmpleados);
router.get('/:dni', authMiddleware.verificarAutenticacionEmpleado, empleadoController.obtenerEmpleadoPorDni);
router.put('/:dni', authMiddleware.verificarAutenticacionEmpleado, empleadoController.actualizarEmpleadoPorDni);
router.delete('/:dni', authMiddleware.verificarAutenticacionEmpleado, empleadoController.eliminarEmpleadoPorDni);

module.exports = router;
