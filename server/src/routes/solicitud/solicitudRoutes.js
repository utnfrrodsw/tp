const express = require('express');
const router = express.Router();

const solicitudController = require( "../../controllers/solicitud/solicitudController.js");

router.get('/:id',solicitudController.getSolicitud);

module.exports=router;