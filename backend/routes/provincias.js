const express = require('express');
const router = express.Router();
const provinciaController = require('../controllers/provinciaController');

router.get('/', provinciaController.obtenerTodasProvincias);
router.post('/', provinciaController.crearProvincia);
router.get('/:id', provinciaController.obtenerProvinciaPorId);
router.put('/:id', provinciaController.actualizarProvincia);
router.delete('/:id', provinciaController.eliminarProvincia);

module.exports = router;