import { Router } from 'express';
import {
	subscribe,
	unsubscribe,
	unsubscribeByToken,
	getAllSubscriptions,
	getRecipientsSummary,
	sendAdminCampaign,
	sendAdminTestEmail,
	previewAdminCampaign,
	getCampaignHistory,
	validateAdminCampaign,
	getCampaignDetail,
} from '../controllers/newsletter.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

/**
 * POST /api/newsletter/subscribe
 * Suscribirse a la newsletter
 */
router.post('/subscribe', subscribe);

/**
 * POST /api/newsletter/unsubscribe
 * Cancelar suscripción a la newsletter
 */
router.post('/unsubscribe', unsubscribe);

/**
 * GET /api/newsletter/unsubscribe/:token
 * Cancelar suscripción desde enlace de email
 */
router.get('/unsubscribe/:token', unsubscribeByToken);

/**
 * GET /api/newsletter/subscriptions
 * Obtener todas las suscripciones (solo admin)
 */
router.get('/subscriptions', authenticateJWT, requireAdmin, getAllSubscriptions);

/**
 * GET /api/newsletter/admin/recipients-summary
 * Obtener resumen de destinatarios para campaña (solo admin)
 */
router.get('/admin/recipients-summary', authenticateJWT, requireAdmin, getRecipientsSummary);

/**
 * POST /api/newsletter/admin/send
 * Enviar campaña newsletter (solo admin)
 */
router.post('/admin/send', authenticateJWT, requireAdmin, sendAdminCampaign);

/**
 * POST /api/newsletter/admin/send-test
 * Enviar email de prueba (solo admin)
 */
router.post('/admin/send-test', authenticateJWT, requireAdmin, sendAdminTestEmail);

/**
 * POST /api/newsletter/admin/preview
 * Generar preview renderizado de campaña (solo admin)
 */
router.post('/admin/preview', authenticateJWT, requireAdmin, previewAdminCampaign);

/**
 * POST /api/newsletter/admin/validate
 * Validar campaña sin enviar (solo admin)
 */
router.post('/admin/validate', authenticateJWT, requireAdmin, validateAdminCampaign);

/**
 * GET /api/newsletter/admin/history
 * Historial de campañas (solo admin)
 */
router.get('/admin/history', authenticateJWT, requireAdmin, getCampaignHistory);

/**
 * GET /api/newsletter/admin/campaigns/:id
 * Detalle de campaña para duplicar/reusar (solo admin)
 */
router.get('/admin/campaigns/:id', authenticateJWT, requireAdmin, getCampaignDetail);

export default router;
