const express = require('express');
const router = express.Router();

const upload = require('../middlewares/solicitud/multerSolicitudes.js');

const solicitudController = require( "../controllers/solicitud/solicitudController.js");

router.get('/:id', solicitudController.getSolicitud);

router.get('/:estado/cliente/:id', solicitudController.getSolicitudesClienteEstado);

router.post('/cliente/:id', upload ,solicitudController.createSolicitud);

router.delete('/cancelar/:id', solicitudController.CancelarSolicitud);

router.get('/nuevas/prestador/:id', solicitudController.getSolicitudesProfesion);

router.get('/presupuestadas/prestador/:id',solicitudController.getSolicitudesPresupuestadas); 

router.get('/aceptadas/prestador/:id',solicitudController.getSolicitudesPresupuestadas); 

module.exports=router;