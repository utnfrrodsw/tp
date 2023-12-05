const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/', verificarToken, albumController.getAlbums);
router.post('/', verificarToken, verificarRol, albumController.createAlbum);
router.get('/:id', verificarToken, albumController.getAlbumById);
router.patch('/:id', verificarToken, verificarRol, albumController.updateAlbum);
router.delete('/:id', verificarToken, verificarRol, albumController.deleteAlbum);

module.exports = router;
