const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);



// Rutas protegidas: solo admin puede crear, actualizar y borrar productos
router.post('/', authenticate, isAdmin, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;
