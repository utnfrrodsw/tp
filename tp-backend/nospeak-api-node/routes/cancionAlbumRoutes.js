const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/:album_id', verificarToken ,cancionController.getCancionesPorAlbum);

module.exports = router;
