const express = require('express');
const router = express.Router();

const {
  getAllOrderProducts,
  createOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
} = require('../controllers/orderProductsController');

// Obtener todos
router.get('/', getAllOrderProducts);

// Crear 
router.post('/', createOrderProduct);

// Actualizar  (cantidad o precio)
router.put('/:order_id/:product_id', updateOrderProduct);

// Eliminar 
router.delete('/:order_id/:product_id', deleteOrderProduct);

module.exports = router;
