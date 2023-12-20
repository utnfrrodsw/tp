import express from 'express';
import {verifyTokenUser, verifyTokenAdmin } from '../middlewares/token.mjs'
import {createReview, getAll } from '../controllers/ReviewController.mjs'
const router = express.Router();

router.post('/create-review', verifyTokenUser, createReview);
router.get('/review', verifyTokenAdmin, getAll);


export default router;