const router = require('express').Router()
const usuarioController = require('../controlador/usuario');

// * https://medium.com/techno101/crud-using-node-js-express-and-sequelize-82c10ef3b346

router.post('/',usuarioController.addUsuario)

router.delete('/:id',usuarioController.deleteById)

router.put('/:id',usuarioController.updateUsuario)

router.put('/:id/tokens',usuarioController.enviarTokens)

router.post('/:id/habilitado',usuarioController.cambiarHabilitado)

router.get('/',usuarioController.findUsuarios)

router.get('/:id',usuarioController.findUsuarioById)

router.get('/buscar/:query',usuarioController.findUsuariosFuzzilyByName)

module.exports = router