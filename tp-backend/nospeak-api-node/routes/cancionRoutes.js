const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/', verificarToken, cancionController.getCanciones);
router.post('/', verificarToken, verificarRol, cancionController.createCancion);
router.get('/:id', verificarToken, cancionController.getCancionById);
router.patch('/:id', verificarToken, verificarRol, cancionController.updateCancion);
router.delete('/:id', verificarToken, verificarRol, cancionController.deleteCancion);

module.exports = router;
