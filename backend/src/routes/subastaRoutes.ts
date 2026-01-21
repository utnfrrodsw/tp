import express from 'express';
import { SubastaController } from '../controllers/SubastaController';

const router: express.Router = express.Router();

router.get('/', SubastaController.getAll);
router.get('/camiseta/:camisetaId', SubastaController.getByCamiseta); // ✅ ANTES de /:id
router.get('/:id', SubastaController.getById);
router.post('/', SubastaController.create);
router.put('/:id/finalizar', SubastaController.finalizar);

export default router;
