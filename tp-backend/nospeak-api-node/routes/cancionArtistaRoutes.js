const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/:artista_id', verificarToken, cancionController.getCancionesPorArtista);

module.exports = router;
