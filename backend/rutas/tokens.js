const router = require('express').Router()
const tokensController = require('../controlador/tokens');

router.get('/',tokensController.obtenerCantidadCirculando)
router.post('/',tokensController.generar)
router.patch('/',tokensController.enviar)

module.exports = router