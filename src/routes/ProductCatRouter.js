import express from 'express';
import funciones from '../controllers/ProductCatController.js'
import middlewares from '../middlewares/token.js'
const router = express.Router();

router.post('/admin-categorias', middlewares.verifyTokenAdmin, funciones.createCategory);
router.get('/categorias', middlewares.verifyTokenUser, funciones.getAll);
router.get('/categorias/:id', middlewares.verifyTokenUser, funciones.getByID);
router.put('/admin-categorias/:id', middlewares.verifyTokenAdmin, funciones.UpdateCategory);
router.delete('/admin-categorias/:id', middlewares.verifyTokenAdmin, funciones.deleteById);

export default router;