const express = require('express');
const router = express.Router();
const estadiaServicioController = require('../controllers/estadiaServicioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para empleados
router.get('/', authMiddleware.verificarAutenticacionEmpleado, estadiaServicioController.obtenerTodasEstadiaServicios);
router.delete('/:idServicio/:idEstadia', authMiddleware.verificarAutenticacionEmpleado, estadiaServicioController.eliminarEstadiaServicio);

// Rutas accesibles por todos
router.post('/', estadiaServicioController.crearEstadiaServicio);
router.get('/:idEstadia', estadiaServicioController.obtenerServiciosPorEstadia);

module.exports = router;

