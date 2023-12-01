const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/albums', verificarToken, albumController.getAlbums);
router.post('/albums', verificarToken, verificarRol, albumController.createAlbum);
router.get('/albums/:id', verificarToken, albumController.getAlbumById);
router.patch('/albums/:id', verificarToken, verificarRol, albumController.updateAlbum);
router.delete('/albums/:id', verificarToken, verificarRol, albumController.deleteAlbum);

module.exports = router;
