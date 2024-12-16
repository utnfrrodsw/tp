const express = require('express');
const router = express.Router();
const localidadController = require('../controllers/localidadController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', localidadController.obtenerTodasLocalidades);

router.get('/:id', localidadController.obtenerLocalidadPorId);

router.get('/nombre/:nombre', localidadController.obtenerLocalidadPorNombre);
router.get('/:nombreLocalidad/:nombreProvincia', localidadController.obtenerLocalidadYProvincia);

// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, localidadController.crearLocalidad);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, localidadController.actualizarLocalidad);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, localidadController.eliminarLocalidad);

module.exports = router;
