const express = require('express');
const router = express.Router();
const localidadController = require('../controllers/localidadController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas accesibles por todos los usuarios (solo `GET`)
router.get('/', localidadController.obtenerTodasLocalidades);

router.get('/:id', localidadController.obtenerLocalidadPorId);
router.get('/nombre/:nombre', localidadController.obtenerLocalidadPorNombre);


// Rutas accesibles solo por empleados
router.post('/', authMiddleware.verificarAutenticacionEmpleado, localidadController.crearLocalidad);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, localidadController.actualizarLocalidad);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, localidadController.eliminarLocalidad);

module.exports = router;
