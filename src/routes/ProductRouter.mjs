import express from 'express';
import {
    createProduct, getAll, getAllByShop, paginated
} from '../controllers/ProductController.mjs'
import {
    verifyTokenSeller, verifyTokenUser
} from '../middlewares/token.mjs'
const router = express.Router();

router.post('/create-product', verifyTokenSeller, createProduct);
router.get('/products',  getAll);
router.get('/productsbyshop/:tiendaId', verifyTokenSeller, getAllByShop);
router.get('/productos', verifyTokenUser, paginated);

export default router;
