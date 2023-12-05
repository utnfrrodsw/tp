const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.post('/', usuarioController.loginUsuario);

module.exports = router;
