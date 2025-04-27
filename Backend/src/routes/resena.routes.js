import { Router } from 'express';
import { resenaController } from '../controllers/resena.controller';
const router = Router();
// Usa async/await correctamente con Express y pasa la función de manejo de errores
router.get('/:id', async (req, res, next) => {
    try {
        await resenaController.getResenaById(req, res);
    }
    catch (err) {
        next(err); // Pasa el error al manejador global de errores de Express
    }
});
router.post('/', async (req, res, next) => {
    try {
        await resenaController.createResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await resenaController.updateResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await resenaController.deleteResena(req, res);
    }
    catch (err) {
        next(err);
    }
});
export default router;
