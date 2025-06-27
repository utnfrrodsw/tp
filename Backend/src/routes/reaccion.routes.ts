// src/routes/reaccion.routes.ts
import { Router } from 'express';
import { getReaccionesByResena, addOrUpdateReaccion, deleteReaccion } from '../controllers/reaccion.controller';

const router = Router();

router.get('/resena/:resenaId', getReaccionesByResena);
router.post('/', addOrUpdateReaccion);
router.delete('/:id', deleteReaccion);

export { router as reaccionRoutes };
