const express = require('express');
const router = express.Router();

const servicioController = require('../controllers/serviciosController.js');

router.get('/isreviewed/:idSolicitud/:idUsuario', servicioController.isReviewed);

router.patch('/setreview/:idSolicitud/:idUsuario', servicioController.setReview);

router.patch('/aterminar/:idSolicitud/prestador/:id',servicioController.setAConfirmar);

module.exports = router;