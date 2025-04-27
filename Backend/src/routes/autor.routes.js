import { Router } from 'express';
import * as autorController from '../controllers/autor.controller';
const router = Router();
// Definir las rutas para los autores
router.get('/', autorController.getAutores);
export { router as autorRoutes };
