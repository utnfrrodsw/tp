// src/controllers/feed.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';
import { FeedService } from '../services/feed.service';
import { TipoActividad } from '../entities/actividad.entity';

/**
 * Obtiene el feed de actividades de usuarios seguidos
 */
export const getFeed = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;

    const usuarioPayload = (req as any).user;
    if (!usuarioPayload || typeof usuarioPayload === 'string' || !('id' in usuarioPayload)) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const usuario = await orm.em.findOne(Usuario, { id: usuarioPayload.id });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Parámetros de paginación y filtrado
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    
    // Filtrar por tipos de actividad (opcional)
    const tiposParam = req.query.tipos as string;
    const tipos: TipoActividad[] | undefined = tiposParam
      ? tiposParam.split(',').filter(t => Object.values(TipoActividad).includes(t as TipoActividad)) as TipoActividad[]
      : undefined;

    // Detectar si es un force refresh (presencia del parámetro _t)
    const forceRefresh = req.query._t !== undefined;

    if (forceRefresh) {
      console.log(`🔄 Force refresh solicitado por usuario ${usuario.id}`);
    }

    // Obtener feed
    const feedService = new FeedService(orm);
    const result = await feedService.getFeedActividades(usuario.id, limit, offset, tipos, forceRefresh);

    res.json({
      actividades: result.actividades,
      total: result.total,
      limit,
      offset,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error al obtener feed:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al obtener feed' 
    });
  }
};

/**
 * Invalida el caché del feed del usuario autenticado
 */
export const invalidarCacheFeed = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;

    const usuarioPayload = (req as any).user;
    if (!usuarioPayload || typeof usuarioPayload === 'string' || !('id' in usuarioPayload)) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const feedService = new FeedService(orm);
    await feedService.invalidarCache(usuarioPayload.id);

    res.json({ message: 'Caché de feed invalidado con éxito' });
  } catch (error) {
    console.error('Error al invalidar caché de feed:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al invalidar caché' 
    });
  }
};
