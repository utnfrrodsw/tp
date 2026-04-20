import { Router } from 'express';
import * as resenaController from '../controllers/resena.controller';
import { authenticateJWT, optionalAuthenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/', optionalAuthenticateJWT, resenaController.getResenas);
router.get('/populares', optionalAuthenticateJWT, resenaController.getResenasPopulares); // Debe ir ANTES de /:id
router.get('/:id', resenaController.getResenaById);
router.post('/', authenticateJWT, resenaController.createResena);
router.put('/:id', authenticateJWT, resenaController.updateResena);
router.delete('/:id', authenticateJWT, resenaController.deleteResena);

// Admin-only routes for moderation
router.put('/:id/approve', authenticateJWT, requireAdmin, resenaController.approveResena);
router.put('/:id/reject', authenticateJWT, requireAdmin, resenaController.rejectResena);
router.get('/admin/rechazadas', authenticateJWT, requireAdmin, resenaController.getResenasRechazadas);
router.get('/admin/moderation/stats', authenticateJWT, requireAdmin, resenaController.getModerationStats);

// Moderation analysis endpoint (testing/admin)
router.post('/analyze', authenticateJWT, resenaController.analyzeResena);

// Reply to a review
router.post('/:id/responder', authenticateJWT, resenaController.createRespuesta);

export { router as resenaRoutes };
