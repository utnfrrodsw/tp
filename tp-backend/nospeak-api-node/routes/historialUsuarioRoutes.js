const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/:usuario_id', verificarToken, historialController.getHistorialByUsuario);

module.exports = router;
