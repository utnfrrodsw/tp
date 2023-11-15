const express = require('express');
const router = express.Router();

const upload = require('../middlewares/solicitud/multerSolicitudes.js');
const {validateSolicitudCreate} = require('../middlewares/solicitud/validateSolicitudCreate.js');

const solicitudController = require( "../controllers/solicitud/solicitudController.js");

router.get('/:id', solicitudController.getSolicitud);

router.get('/nuevas/prestador/:id/presupuestar',solicitudController.getSolicitud);

router.get('/:estado/cliente/:id', solicitudController.getSolicitudesClienteEstado);

router.post('/cliente/:id', upload , validateSolicitudCreate ,solicitudController.createSolicitud);

router.delete('/cancelar/:id', solicitudController.CancelarSolicitud);

router.get('/nuevas/prestador/:id/:estado', solicitudController.getSolicitudesProfesion);

router.get('/presupuestadas/prestador/:id/:estado',solicitudController.getSolicitudesPresupuestadas); 

router.get('/aceptadas/prestador/:id/:estado',solicitudController.getSolicitudesAceptadas);

router.patch('/updateEstado/:id', solicitudController.updateEstado);

module.exports=router;