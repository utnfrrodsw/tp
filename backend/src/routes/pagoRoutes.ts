import express from 'express';
import { PagoController } from '../controllers/PagoController';

const router: express.Router = express.Router();

router.get('/', PagoController.getAll);
router.get('/:id', PagoController.getById);
router.get('/compra/:compraId', PagoController.getByCompra);
router.post('/', PagoController.create);
router.put('/:id/confirmar', PagoController.confirmar);
router.put('/:id/rechazar', PagoController.rechazar);

export default router;
