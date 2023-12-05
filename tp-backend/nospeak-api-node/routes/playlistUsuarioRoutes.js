const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');

router.get('/:usuario_id', verificarToken, playlistController.getPlaylistsByUsuario);

module.exports = router;
