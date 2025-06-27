import { Router } from 'express';
import { resenaController } from '../controllers/resena.controller';

const router = Router();

router.get('/', resenaController.getResenas);
router.get('/:id', resenaController.getResenaById);
router.post('/', resenaController.createResena);
router.put('/:id', resenaController.updateResena);
router.delete('/:id', resenaController.deleteResena);

export { router as resenaRoutes };
