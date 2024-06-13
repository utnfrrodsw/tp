const express = require('express');
const router = express.Router();
const estadiaController = require('../controllers/estadiaController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.iniciarSesion);
router.post('/', estadiaController.crearEstadia);
router.get('/', estadiaController.obtenerTodasEstadias); 
router.get('/:id', estadiaController.obtenerEstadiaPorId);
router.put('/:id', estadiaController.actualizarEstadia);
router.put('/:idEstadia/checkin', estadiaController.realizarCheckin);
router.put('/:idEstadia/checkout', estadiaController.realizarCheckout);
router.delete('/:id', estadiaController.eliminarEstadia);


router.post('/reservar-habitacion', authMiddleware.verificarAutenticacion, estadiaController.reservarHabitacion);

module.exports = router;

