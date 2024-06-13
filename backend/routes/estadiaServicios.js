// estadiaServicioRoutes.js

const express = require('express');
const router = express.Router();
const estadiaServicioController = require('../controllers/estadiaServicioController');

// Rutas para Estadia-Servicio
router.post('/', estadiaServicioController.crearEstadiaServicio);


module.exports = router;
