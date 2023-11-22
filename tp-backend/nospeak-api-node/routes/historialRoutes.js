const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');
const verificarRol = require('../middlewares/verificarRolMiddleware');

router.get('/historiales', verificarToken, historialController.getHistoriales);
router.post('/historiales', verificarToken, historialController.createHistorial);
router.get('/historiales/:id', verificarToken, historialController.getHistorialById);
router.patch('/historiales/:id', verificarToken, historialController.updateHistorial);
router.delete('/historiales/:id', verificarToken, verificarRol, historialController.deleteHistorial);
router.get('/historiales-usuario/:usuario_id', verificarToken, verificarRol, historialController.getHistorialByUsuario);

module.exports = router;
