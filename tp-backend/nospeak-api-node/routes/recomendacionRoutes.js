const express = require('express');
const router = express.Router();
const recomendacionController = require('../controllers/recomendacionController');
const verificarToken = require('../middlewares/verificarTokenMiddleware');

router.post('/recomendaciones', verificarToken, recomendacionController.createRecomendacion);

module.exports = router;
