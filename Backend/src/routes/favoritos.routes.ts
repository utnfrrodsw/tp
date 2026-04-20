import { Router } from 'express';
import { getFavoritos, addFavorito, deleteFavorito } from '../controllers/favorito.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.get('/mis-favoritos', authenticateJWT, getFavoritos);
router.post('/', authenticateJWT, addFavorito);
router.delete('/:favoritoId', authenticateJWT, deleteFavorito);

export { router as favoritosRoutes };
