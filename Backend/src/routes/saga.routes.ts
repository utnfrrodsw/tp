import { Router } from 'express';
import { getSagas, getSagaById, createSaga, updateSaga, deleteSaga } from '../controllers/saga.controller';

const router = Router();
router.get('/', getSagas);
router.get('/:id', getSagaById);
router.post('/', createSaga);
router.put('/:id', updateSaga);
router.delete('/:id', deleteSaga);

export { router as sagaRoutes };
