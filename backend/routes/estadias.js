const express = require('express');
const router = express.Router();
const estadiaController = require('../controllers/estadiaController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para clientes
router.get('/cliente/:idCli',authMiddleware.verificarAutenticacion,estadiaController.obtenerEstadiasPorCliente);
router.post('/reservar-habitacion', authMiddleware.verificarAutenticacion, estadiaController.reservarHabitacion);
router.put('/:id', authMiddleware.verificarAutenticacion, estadiaController.actualizarEstadoEstadia);

// Rutas para empleados
router.get('/', authMiddleware.verificarAutenticacionEmpleado, estadiaController.obtenerTodasEstadias); 
router.get('/:id', authMiddleware.verificarAutenticacionEmpleado, estadiaController.obtenerEstadiaPorId);
router.post('/',  estadiaController.crearEstadia);
router.put('/:idEstadia/checkin', authMiddleware.verificarAutenticacionEmpleado, estadiaController.realizarCheckin);
router.put('/:idEstadia/checkout', estadiaController.realizarCheckout);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, estadiaController.eliminarEstadia);

module.exports = router;
