const express = require('express');
const router = express.Router();

const upload = require('../middlewares/solicitud/multerSolicitudes.js');

const solicitudController = require( "../controllers/solicitud/solicitudController.js");

router.get('/:id',solicitudController.getSolicitud);

router.get('/client/:id/solicitudesActivas', solicitudController.getSolicitudesActivasCliente);

router.post('/cliente/:id', upload ,solicitudController.createSolicitud);

module.exports=router;