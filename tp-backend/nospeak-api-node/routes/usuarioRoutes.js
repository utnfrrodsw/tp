const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/', verificarToken, verificarRol,usuarioController.getUsuarios);
router.post('/', usuarioController.createUsuario);
router.get('/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/:id', verificarToken, usuarioController.deleteUsuario);

module.exports = router;
