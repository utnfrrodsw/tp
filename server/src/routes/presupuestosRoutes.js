const express = require('express');
const router = express.Router();

const presupuestosController = require('../controllers/presupuestoscontroler.js');

router.get('/solicitud/:idSolictud', presupuestosController.getPresupuestosSolicitud);
router.patch('/pagar/:idSolicitud/:idPrestador', presupuestosController.pagarPresupuesto);
router.post('/nuevoPresupuesto', presupuestosController.createPresupuesto);
router.get('/solicitud/:idSolicitud/prestador/:user.id',presupuestosController.getPresupuestoByPK);
module.exports = router;
