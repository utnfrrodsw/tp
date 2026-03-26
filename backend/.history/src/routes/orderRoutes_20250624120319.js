const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');


// Obtener todos los pedidos (solo admin)
router.get('/',authenticate, isAdmin, orderController.getAllOrders);

// Obtener pedido por ID (usuario dueño o admin)
router.get('/:id', authenticate, orderController.getOrderById);

// Crear pedido (usuario autenticado)
router.post('/', authenticate, orderController.createOrder);

// Actualizar estado del pedido (solo admin)
router.put('/:id',authenticate, isAdmin, orderController.updateOrder);

// Borrar pedido (solo admin)
router.delete('/:id',authenticate, isAdmin, orderController.deleteOrder);

module.exports = router;
