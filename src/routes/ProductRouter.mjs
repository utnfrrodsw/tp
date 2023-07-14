import express from 'express';
import {
    createProduct, getAll, getAllByShop
} from '../controllers/ProductController.mjs'
import {
    verifyTokenSeller, verifyTokenUser
} from '../middlewares/token.mjs'
const router = express.Router();

router.post('/create-product', verifyTokenSeller, createProduct);
router.get('/products', verifyTokenSeller, getAll);
router.get('/productsbyshop/:tiendaId', verifyTokenSeller, getAllByShop);

export default router;