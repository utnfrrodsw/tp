const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/usuarios', verificarToken, verificarRol,usuarioController.getUsuarios);
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/usuarios/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/usuarios/:id', verificarToken, usuarioController.deleteUsuario);
router.post('/usuarios-login/', usuarioController.loginUsuario);

module.exports = router;
