const router = require('express').Router()
const tokensController = require('../controlador/tokens');

router.get('/',tokensController.obtenerCantidadCirculando)

module.exports = router