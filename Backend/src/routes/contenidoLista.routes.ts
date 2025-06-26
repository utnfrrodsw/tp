import { Router } from 'express';
import {
  getContenidoLista,
  addLibroALista,
  removeLibroDeLista
} from '../controllers/contenidoLista.controller';

const router = Router();

router.get('/:listaId', getContenidoLista);
router.post('/', addLibroALista);
router.delete('/:listaId/:libroId', removeLibroDeLista);

export { router as contenidoListaRoutes };
