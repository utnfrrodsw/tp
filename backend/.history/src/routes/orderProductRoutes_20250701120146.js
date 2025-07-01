const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderProductController');

// Crear relación
router.post('/', controller.create);

// Obtener todas
router.get('/', controller.getAll);

// Obtener una relación por IDs
router.get('/:orderId/:productId', controller.getById);

// Actualizar cantidad
router.put('/:orderId/:productId', controller.update);

// Eliminar
router.delete('/:orderId/:productId', controller.remove);

module.exports = router;
