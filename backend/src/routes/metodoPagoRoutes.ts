import express from 'express';
import { MetodoPagoController } from '../controllers/MetodoPagoController';

const router: express.Router = express.Router();

router.get('/', MetodoPagoController.getAll);
router.get('/:id', MetodoPagoController.getById);
router.post('/', MetodoPagoController.create);
router.put('/:id', MetodoPagoController.update);
router.delete('/:id', MetodoPagoController.delete);

export default router;
