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
router.put('/:orderId/:productId', updateOrderProduct);
// Eliminar 
router.delete('/:orderId/:productId', deleteOrderProduct);



module.exports = router;
