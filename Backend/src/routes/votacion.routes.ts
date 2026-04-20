// src/routes/votacion.routes.ts
import { Router } from 'express';
import {
  votarLibro,
  eliminarVoto,
  obtenerVotoUsuario,
  obtenerEstadisticasLibro,
  obtenerLibrosMasVotados,
} from '../controllers/votacion.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/votacion
 * @desc    Votar por un libro (positivo o negativo)
 * @access  Privado (requiere autenticación)
 * @body    { libroId: number, voto: 'positivo' | 'negativo' }
 */
router.post('/', authenticateJWT, votarLibro);

/**
 * @route   DELETE /api/votacion/:libroId
 * @desc    Eliminar voto de un libro
 * @access  Privado (requiere autenticación)
 */
router.delete('/:libroId', authenticateJWT, eliminarVoto);

/**
 * @route   GET /api/votacion/usuario/:libroId
 * @desc    Obtener el voto del usuario para un libro específico
 * @access  Privado (requiere autenticación)
 */
router.get('/usuario/:libroId', authenticateJWT, obtenerVotoUsuario);

/**
 * @route   GET /api/votacion/estadisticas/:libroId
 * @desc    Obtener estadísticas de votación de un libro
 * @access  Público
 */
router.get('/estadisticas/:libroId', obtenerEstadisticasLibro);

/**
 * @route   GET /api/votacion/top
 * @desc    Obtener libros más votados positivamente
 * @access  Público
 * @query   limit (opcional, default: 10)
 */
router.get('/top', obtenerLibrosMasVotados);

export default router;
