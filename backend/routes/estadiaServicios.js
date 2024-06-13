const express = require('express');
const router = express.Router();
const estadiaServicioController = require('../controllers/estadiaServicioController');


router.post('/', estadiaServicioController.crearEstadiaServicio);


module.exports = router;
