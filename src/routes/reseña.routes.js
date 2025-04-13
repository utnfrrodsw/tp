import { Router } from 'express';
import * as resenaController from '../controllers/resena.controller'; // Usa 'resenaController' en lugar de 'reseñaController'
const router = Router();
router.get('/', resenaController.getResenas); // Cambia reseñaController a resenaController
router.get('/:id', resenaController.getResenaById); // Cambia reseñaController a resenaController
router.post('/', resenaController.createResena); // Cambia reseñaController a resenaController
router.put('/:id', resenaController.updateResena); // Cambia reseñaController a resenaController
router.delete('/:id', resenaController.deleteResena); // Cambia reseñaController a resenaController
export { router as resenaRoutes };
