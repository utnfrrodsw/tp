import { Router } from 'express';
import { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoria.controller';

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export { router as categoriaRoutes };
