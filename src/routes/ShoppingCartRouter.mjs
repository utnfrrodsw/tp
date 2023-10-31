import express from 'express';
import { verifyTokenUser } from '../middlewares/token.mjs';
import { saveCart } from '../controllers/ShoppingCartController.mjs';

const router = express.Router();

router.post('/comprar', saveCart);

export default router;