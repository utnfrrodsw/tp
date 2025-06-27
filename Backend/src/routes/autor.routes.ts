import { Router } from 'express';
import { getAutores, getAutorById, createAutor, updateAutor, deleteAutor } from '../controllers/autor.controller';

const router = Router();

router.get('/', getAutores);
router.get('/:id', getAutorById);
router.post('/', createAutor);
router.put('/:id', updateAutor);
router.delete('/:id', deleteAutor);

export { router as autorRoutes };
