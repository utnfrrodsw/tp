import express from 'express';
import {
    createProduct, getAll, getAllByShop, paginated, getOne, deleteProduct, updateProduct, maxPaginationIndex
} from '../controllers/ProductController.mjs'
import {
    verifyTokenSeller, verifyTokenUser
} from '../middlewares/token.mjs'
const router = express.Router();

router.post('/create-product', verifyTokenSeller, createProduct);
router.get('/products', getAll);
router.get('/products/:id', getOne);
router.put('/products/:productId', verifyTokenSeller, updateProduct);
router.get('/productsbyshop/:tiendaId', verifyTokenSeller, getAllByShop);
router.get('/productos', verifyTokenUser, paginated);
router.delete('/products/:id', verifyTokenSeller, deleteProduct);
router.get('/productos/paginate', maxPaginationIndex);

export default router;
