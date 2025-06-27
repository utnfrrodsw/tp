import { Router } from 'express';
import { getEditoriales, getEditorialById, createEditorial, updateEditorial, deleteEditorial } from '../controllers/editorial.controller';

const router = Router();

router.get('/', getEditoriales);
router.get('/:id', getEditorialById);
router.post('/', createEditorial);
router.put('/:id', updateEditorial);
router.delete('/:id', deleteEditorial);

export { router as editorialRoutes };
