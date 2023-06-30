import express from 'express';
import {createCategory, getAll,getByID, UpdateCategory, deleteById } from '../controllers/ProductCatController.mjs'
import {verifyTokenUser, verifyTokenAdmin } from '../middlewares/token.mjs'
const router = express.Router();

router.post('/admin-categorias', verifyTokenAdmin, createCategory);
router.get('/categorias', verifyTokenUser, getAll);
router.get('/categorias/:id', verifyTokenUser, getByID);
router.put('/admin-categorias/:id', verifyTokenAdmin, UpdateCategory);
router.delete('/admin-categorias/:id', verifyTokenAdmin, deleteById);

export default router;