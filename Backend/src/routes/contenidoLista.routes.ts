// src/routes/contenidoLista.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeListaOwner } from '../middleware/listaAuth.middleware';
import { getContenidoLista, addLibroALista, removeLibroDeLista, getAllUserContenido } from '../controllers/contenidoLista.controller';

const router = Router();

router.get('/:listaId', authenticateJWT, authorizeListaOwner, getContenidoLista);
router.get('/user/all', authenticateJWT, getAllUserContenido);
router.post('/', authenticateJWT, authorizeListaOwner, addLibroALista);
router.delete('/:listaId/:libroId', authenticateJWT, authorizeListaOwner, removeLibroDeLista);

export { router as contenidoListaRoutes };
