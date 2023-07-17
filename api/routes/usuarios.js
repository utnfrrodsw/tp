const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarios')
const auth = require('../middlewares/auth')

// api/usuarios
router.get('/', auth, usuarioController.getUsuarios)
router.get('/:id', auth, usuarioController.getUsuario)
router.put('/:id', usuarioController.updateUsuario)

module.exports = router
