const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/artistas', verificarToken, artistaController.getArtistas);
router.post('/artistas', verificarToken, verificarRol, artistaController.createArtista);
router.get('/artistas/:id', verificarToken, artistaController.getArtistaById);
router.patch('/artistas/:id', verificarToken, verificarRol, artistaController.updateArtista);
router.delete('/artistas/:id', verificarToken, verificarRol, artistaController.deleteArtista);

module.exports = router;
