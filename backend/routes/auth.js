const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.iniciarSesion);
router.post('/login/empleado', authController.iniciarSesionEmpleado);
module.exports = router;
