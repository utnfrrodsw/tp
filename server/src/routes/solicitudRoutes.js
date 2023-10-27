const express = require('express');
const router = express.Router();

const upload = require('../middlewares/solicitud/multerSolicitudes.js');

const solicitudController = require( "../controllers/solicitud/solicitudController.js");

router.get('/:id', solicitudController.getSolicitud);

router.get('/:estado/cliente/:id', solicitudController.getSolicitudesClienteEstado);

router.post('/cliente/:id', upload ,solicitudController.createSolicitud);

router.delete('/cancelar/:id', solicitudController.CancelarSolicitud);

router.get('/:estado/prestador/:id', solicitudController.getSolicitudesProfesion);

//router.get('/:estado/prestador/:id',solicitudController.getSolicitudesPresupuestadas); Ver como mierda hacer para diferenciar entre esta y la de arriba

module.exports=router;