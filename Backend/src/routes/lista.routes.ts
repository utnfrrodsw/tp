import { Router } from 'express';
import { getListas, getListaById, createLista, updateLista, deleteLista } from '../controllers/lista.controller';

const router = Router();

router.get('/', getListas);
router.get('/:id', getListaById);
router.post('/', createLista);
router.put('/:id', updateLista);
router.delete('/:id', deleteLista);

export { router as listaRoutes };
