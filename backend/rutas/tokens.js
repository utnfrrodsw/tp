const router = require('express').Router()
const tokensController = require('../controlador/tokens');

router.get('/',tokensController.obtenerCantidadCirculando)
router.post('/',tokensController.generar)

module.exports = router