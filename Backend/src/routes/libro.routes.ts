import { Router } from 'express';
import * as libroController from '../controllers/libro.controller';

const router = Router();

// Definir las rutas para los libros
router.get('/', libroController.getLibros);

export { router as libroRoutes };
