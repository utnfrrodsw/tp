const express = require('express');
const router = express.Router();
const estadiaServicioController = require('../controllers/estadiaServicioController');


router.post('/', estadiaServicioController.crearEstadiaServicio);
router.get('/', estadiaServicioController.obtenerTodasEstadiaServicios);
router.delete('/:idServicio/:idEstadia', estadiaServicioController.eliminarEstadiaServicio);
router.get('/:idEstadia', estadiaServicioController.obtenerServiciosPorEstadia);

module.exports = router;
