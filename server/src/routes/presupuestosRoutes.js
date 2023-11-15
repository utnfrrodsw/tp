const express = require('express');
const router = express.Router();

const {validatePresupuesto} = require('../middlewares/presupuesto/validatePresupuesto.js');

const presupuestosController = require('../controllers/presupuestoscontroler.js');

router.get('/solicitud/:idSolictud', presupuestosController.getPresupuestosSolicitud);

router.patch('/pagar/:idSolicitud/:idPrestador', presupuestosController.pagarPresupuesto);

router.post('/nuevoPresupuesto', validatePresupuesto ,presupuestosController.createPresupuesto);

router.get('/solicitud/:idSolicitud/prestador/:id',presupuestosController.getPresupuestoByPK);

module.exports = router;
