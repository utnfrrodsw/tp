const express = require('express');
const router = express.Router();
const estadiaController = require('../controllers/estadiaController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para clientes
router.post('/login', authController.iniciarSesion);
router.post('/reservar-habitacion', authMiddleware.verificarAutenticacion, estadiaController.reservarHabitacion);

// Rutas para empleados
router.post('/login/empleado', authController.iniciarSesionEmpleado);
router.get('/', authMiddleware.verificarAutenticacionEmpleado, estadiaController.obtenerTodasEstadias); 
router.get('/:id', authMiddleware.verificarAutenticacionEmpleado, estadiaController.obtenerEstadiaPorId);
router.post('/', authMiddleware.verificarAutenticacionEmpleado, estadiaController.crearEstadia);
router.put('/:id', authMiddleware.verificarAutenticacionEmpleado, estadiaController.actualizarEstadia);
router.put('/:idEstadia/checkin', authMiddleware.verificarAutenticacionEmpleado, estadiaController.realizarCheckin);
router.put('/:idEstadia/checkout', authMiddleware.verificarAutenticacionEmpleado, estadiaController.realizarCheckout);
router.delete('/:id', authMiddleware.verificarAutenticacionEmpleado, estadiaController.eliminarEstadia);

module.exports = router;
