import express from 'express';
import {
    createProduct, getAll
} from '../controllers/ProductController.mjs'
import {
    verifyTokenSeller, verifyTokenUser
} from '../middlewares/token.mjs'
const router = express.Router();

router.post('/create-product', verifyTokenSeller, createProduct);
router.get('/products', verifyTokenSeller, getAll);

export default router;