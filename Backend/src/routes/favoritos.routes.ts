import { Router } from 'express';
import { getFavoritos, addFavorito, deleteFavorito } from '../controllers/favorito.controller';

const router = Router();

router.get('/:usuarioId', getFavoritos);
router.post('/', addFavorito);
router.delete('/:usuarioId/:libroId', deleteFavorito);

export { router as favoritosRoutes };
