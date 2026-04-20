// src/services/feed.service.ts
import { MikroORM } from '@mikro-orm/core';
import { Actividad, TipoActividad } from '../entities/actividad.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
import redis from '../redis';

interface ActividadEnriquecida {
  id: number;
  tipo: TipoActividad;
  fecha: Date;
  usuario: {
    id: number;
    nombre?: string;
    username: string;
    avatar?: string;
  };
  libro?: {
    id: number;
    nombre?: string;
    autor?: { nombre?: string };
  };
  resena?: {
    id: number;
    contenido?: string;
    estrellas?: number;
    esRespuesta?: boolean;
    resenaPadreAutor?: {
      nombre?: string;
    };
  };
}

export class FeedService {
  private orm: MikroORM;
  private cacheTTL = 300; // 5 minutos

  constructor(orm: MikroORM) {
    this.orm = orm;
  }

  /**
   * Obtiene el feed de actividades de usuarios seguidos
   * @param usuarioId - ID del usuario que solicita el feed
   * @param limit - Cantidad de actividades a retornar
   * @param offset - Paginación
   * @param tipos - Filtrar por tipos de actividad (opcional)
   * @param forceRefresh - Forzar recarga sin usar caché
   */
  async getFeedActividades(
    usuarioId: number,
    limit: number = 20,
    offset: number = 0,
    tipos?: TipoActividad[],
    forceRefresh: boolean = false
  ): Promise<{ actividades: ActividadEnriquecida[]; total: number; hasMore: boolean }> {
    const cacheKey = `feed:usuario:${usuarioId}:${limit}:${offset}:${tipos?.join('-') || 'all'}`;

    // Intentar obtener del caché solo si no es force refresh
    if (redis && offset === 0 && !forceRefresh) { // Solo cachear primera página
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('📦 Feed desde caché para usuario:', usuarioId);
          return JSON.parse(cached);
        }
      } catch (error) {
        console.error('Error al leer caché de feed:', error);
      }
    }

    console.log('🔍 Calculando feed para usuario:', usuarioId);
    const em = this.orm.em.fork();

    // 1. Obtener usuarios seguidos
    const seguimientos = await em.find(Seguimiento, { seguidor: usuarioId });
    const seguidosIds = seguimientos.map(s => s.seguido.id);

    if (seguidosIds.length === 0) {
      return { actividades: [], total: 0, hasMore: false };
    }

    // 2. Construir query de actividades
    const whereCondition: any = {
      usuario: { $in: seguidosIds },
      // EXCLUIR reacciones del feed (no se muestran aunque se guarden en BD)
      tipo: { $ne: TipoActividad.REACCION }
    };

    if (tipos && tipos.length > 0) {
      // Si hay filtro de tipos, combinar con la exclusión de reacciones
      whereCondition.tipo = { $in: tipos, $ne: TipoActividad.REACCION };
    }

    // 3. Obtener actividades con populate
    const [actividades, total] = await em.findAndCount(
      Actividad,
      whereCondition,
      {
        populate: ['usuario', 'libro.autor', 'resena', 'resena.resenaPadre', 'resena.resenaPadre.usuario'],
        orderBy: { fecha: 'DESC' },
        limit,
        offset
      }
    );

    // 4. Enriquecer datos
    const actividadesEnriquecidas: ActividadEnriquecida[] = actividades.map(act => ({
      id: act.id,
      tipo: act.tipo,
      fecha: act.fecha,
      usuario: {
        id: act.usuario.id,
        nombre: act.usuario.nombre,
        username: act.usuario.username,
        avatar: act.usuario.avatar
      },
      libro: act.libro ? {
        id: act.libro.id,
        nombre: act.libro.nombre,
        autor: act.libro.autor ? { nombre: act.libro.autor.nombre } : undefined
      } : undefined,
      resena: act.resena ? {
        id: act.resena.id,
        contenido: act.resena.comentario ? act.resena.comentario.substring(0, 200) : undefined,
        estrellas: act.resena.estrellas,
        esRespuesta: !!act.resena.resenaPadre,
        resenaPadreAutor: act.resena.resenaPadre?.usuario ? {
          nombre: act.resena.resenaPadre.usuario.nombre
        } : undefined
      } : undefined
    }));

    const result = {
      actividades: actividadesEnriquecidas,
      total,
      hasMore: (offset + limit) < total
    };

    // 5. Cachear resultado (solo primera página)
    if (redis && offset === 0) {
      try {
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
        console.log('✅ Feed cacheado:', cacheKey);
      } catch (error) {
        console.error('Error al cachear feed:', error);
      }
    }

    return result;
  }

  /**
   * Registra una nueva actividad en el sistema
   * @param tipo - Tipo de actividad
   * @param usuarioId - ID del usuario que realiza la actividad
   * @param libroId - ID del libro (opcional)
   * @param resenaId - ID de la reseña (opcional)
   */
  async registrarActividad(
    tipo: TipoActividad,
    usuarioId: number,
    libroId?: number,
    resenaId?: number
  ): Promise<Actividad> {
    const em = this.orm.em.fork();

    const actividad = em.create(Actividad, {
      tipo,
      usuario: usuarioId,
      libro: libroId,
      resena: resenaId,
      fecha: new Date()
    });

    await em.persistAndFlush(actividad);

    // Invalidar caché de feeds de los seguidores
    await this.invalidarCacheSeguidores(usuarioId);

    console.log('✅ Actividad registrada:', tipo, 'usuario:', usuarioId);
    return actividad;
  }

  /**
   * Invalida el caché de feeds de los seguidores de un usuario
   */
  private async invalidarCacheSeguidores(usuarioId: number) {
    if (!redis) return;

    try {
      const em = this.orm.em.fork();
      
      // Obtener seguidores del usuario
      const seguidores = await em.find(Seguimiento, { seguido: usuarioId });

      // Invalidar caché de cada seguidor
      for (const seguimiento of seguidores) {
        // Invalidar directamente por IDs conocidos (diferentes combinaciones de paginación)
        for (let i = 0; i < 5; i++) {
          const key = `feed:usuario:${seguimiento.seguidor.id}:20:${i * 20}:all`;
          await redis.del(key);
        }
        console.log(`🗑️ Caché invalidado para seguidor ${seguimiento.seguidor.id}`);
      }
    } catch (error) {
      console.error('Error al invalidar caché de seguidores:', error);
    }
  }

  /**
   * Invalida el caché del feed de un usuario específico
   */
  async invalidarCache(usuarioId: number) {
    if (!redis) return;

    try {
      // Invalidar caché para diferentes combinaciones comunes
      for (let i = 0; i < 5; i++) {
        const key = `feed:usuario:${usuarioId}:20:${i * 20}:all`;
        await redis.del(key);
      }
      console.log('🗑️ Caché de feed invalidado para usuario:', usuarioId);
    } catch (error) {
      console.error('Error al invalidar caché de feed:', error);
    }
  }
}
