const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/', verificarToken, historialController.getHistoriales);
router.post('/', verificarToken, historialController.createHistorial);
router.get('/:id', verificarToken, historialController.getHistorialById);
router.patch('/:id', verificarToken, historialController.updateHistorial);
router.delete('/:id', verificarToken, verificarRol, historialController.deleteHistorial);

module.exports = router;
