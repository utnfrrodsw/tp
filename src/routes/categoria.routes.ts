import { Router } from 'express';
import * as categoriaController from '../controllers/categoria.controller';

const router = Router();

// Definir las rutas para las categorías
router.get('/', categoriaController.getCategorias);

export { router as categoriaRoutes };
