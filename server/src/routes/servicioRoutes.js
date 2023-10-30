const express = require('express');
const router = express.Router();

const servicioController = require('../controllers/serviciosController.js');

router.get('/isreviewed/:idSolicitud/:idUsuario', servicioController.isReviewed);

router.patch('/setreview/:idSolicitud/:idUsuario', servicioController.setReview);

module.exports = router;