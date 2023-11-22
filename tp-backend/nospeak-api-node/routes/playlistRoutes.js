const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');

router.get('/playlists', verificarToken, playlistController.getPlaylists);
router.post('/playlists', verificarToken, playlistController.createPlaylist);
router.get('/playlists/:id', verificarToken, playlistController.getPlaylistById);
router.patch('/playlists/:id', verificarToken, playlistController.updatePlaylist);
router.delete('/playlists/:id', verificarToken, playlistController.deletePlaylist);
router.get('/playlists-usuario/:usuario_id', verificarToken, playlistController.getPlaylistsByUsuario);

module.exports = router;
