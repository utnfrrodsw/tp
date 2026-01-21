import express from 'express';
import { OfertaController } from '../controllers/OfertaController';

const router: express.Router = express.Router();

router.get('/', OfertaController.getAll);
router.get('/:id', OfertaController.getById);
router.post('/', OfertaController.create);
router.put('/:id', OfertaController.update);
router.delete('/:id', OfertaController.delete);

export default router;
