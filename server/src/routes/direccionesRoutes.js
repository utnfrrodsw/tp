const express = require('express');
const router = express.Router();
const { validateDireccion } = require("../middlewares/usuarios/validacionDireccion.js");

const solicitudController = require( "../controllers/direccionesController.js");

router.get('/cliente/:id', solicitudController.getSolicitudCliente);

router.post('/agregarDireccion/cliente/:id', validateDireccion,solicitudController.agregarDireccion);

module.exports = router;