const express = require('express');
const router = express.Router();

const solicitudController = require( "../controllers/solicitud/solicitudController.js");

router.get('/:id',solicitudController.getSolicitud);

router.get('/client/:id/solicitudesActivas', solicitudController.getSolicitudesActivasCliente);

module.exports=router;