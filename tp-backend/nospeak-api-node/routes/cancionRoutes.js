const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/canciones', verificarToken, cancionController.getCanciones);
router.post('/canciones', verificarToken, verificarRol, cancionController.createCancion);
router.get('/canciones/:id', verificarToken, cancionController.getCancionById);
router.patch('/canciones/:id', verificarToken, verificarRol, cancionController.updateCancion);
router.delete('/canciones/:id', verificarToken, verificarRol, cancionController.deleteCancion);
router.get('/canciones-artista/:artista_id', verificarToken, cancionController.getCancionesPorArtista);
router.get('/canciones-album/:album_id', verificarToken ,cancionController.getCancionesPorAlbum);

module.exports = router;
