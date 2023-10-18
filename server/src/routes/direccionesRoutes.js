const express = require('express');
const router = express.Router();

const solicitudController = require( "../controllers/direccionesController.js");

router.get('/cliente/:id', solicitudController.getSolicitudCliente);

module.exports = router;