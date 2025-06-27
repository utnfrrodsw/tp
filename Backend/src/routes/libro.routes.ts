import { Router } from 'express';
import { getLibros, getLibroById, createLibro, updateLibro, deleteLibro } from '../controllers/libro.controller';

const router = Router();

router.get('/', getLibros);
router.get('/:id', getLibroById);
router.post('/', createLibro);
router.put('/:id', updateLibro);
router.delete('/:id', deleteLibro);

export { router as libroRoutes };
