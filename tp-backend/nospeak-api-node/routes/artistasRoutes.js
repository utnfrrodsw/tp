const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/', verificarToken, artistaController.getArtistas);
router.post('/', verificarToken, verificarRol, artistaController.createArtista);
router.get('/:id', verificarToken, artistaController.getArtistaById);
router.patch('/:id', verificarToken, verificarRol, artistaController.updateArtista);
router.delete('/:id', verificarToken, verificarRol, artistaController.deleteArtista);

module.exports = router;
