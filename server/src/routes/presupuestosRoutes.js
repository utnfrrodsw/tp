const express = require('express');
const router = express.Router();

const presupuestosController = require('../controllers/presupuestoscontroler.js');

router.get('/solicitud/:idSolictud', presupuestosController.getPresupuestosSolicitud);

module.exports = router;
