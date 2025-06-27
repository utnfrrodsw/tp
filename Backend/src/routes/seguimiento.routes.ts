// src/routes/seguimiento.routes.ts
import { Router } from 'express';
import { getSeguidores, getSeguidos, followUser, unfollowUser } from '../controllers/seguimiento.controller';

const router = Router();

router.get('/seguidores/:usuarioId', getSeguidores);
router.get('/seguidos/:usuarioId', getSeguidos);
router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);

export { router as seguimientoRoutes };
