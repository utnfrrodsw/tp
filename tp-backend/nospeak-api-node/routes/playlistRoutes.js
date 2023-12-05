const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');

router.get('/', verificarToken, playlistController.getPlaylists);
router.post('/', verificarToken, playlistController.createPlaylist);
router.get('/:id', verificarToken, playlistController.getPlaylistById);
router.patch('/:id', verificarToken, playlistController.updatePlaylist);
router.delete('/:id', verificarToken, playlistController.deletePlaylist);

module.exports = router;
