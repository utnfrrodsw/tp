const express = require('express');
const router = express.Router();
const localidadController = require('../controllers/localidadController');


router.get('/', localidadController.obtenerTodasLocalidades);
router.get('/:id', localidadController.obtenerLocalidadPorId);
router.put('/:id', localidadController.actualizarLocalidad);
router.delete('/:id', localidadController.eliminarLocalidad);
router.post('/', localidadController.crearLocalidad);

module.exports = router;
