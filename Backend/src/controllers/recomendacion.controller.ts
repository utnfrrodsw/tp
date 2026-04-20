// src/controllers/recomendacion.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';
import { Resena, EstadoResena } from '../entities/resena.entity';
import { RecomendacionService } from '../services/recomendacion.service';
import { generateSlug } from '../shared/utils/slug.util';

/**
 * Obtiene recomendaciones personalizadas para el usuario autenticado
 * Considera: favoritos, reseñas, ratings, categorías, autores y recencia
 * Utiliza caché Redis para optimizar respuestas
 */
export const getRecomendaciones = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const usuarioPayload = (req as any).user;
    if (!usuarioPayload || typeof usuarioPayload === 'string' || !('id' in usuarioPayload)) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const usuario = await em.findOne(Usuario, { id: usuarioPayload.id });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Obtener límite de resultados (por defecto 10, máximo 50)
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    // Usar el servicio de recomendaciones mejorado
    const recomendacionService = new RecomendacionService(orm);
    const recomendaciones = await recomendacionService.getRecomendacionesPersonalizadas(usuario.id, limit);

    // Calcular ratings promedio para cada libro
    const librosIds = recomendaciones.map(r => r.libro.id);
    const resenasQuery = await em.find(Resena, 
      { libro: { $in: librosIds }, estado: EstadoResena.APPROVED },
      { fields: ['libro', 'estrellas'] }
    );

    // Agrupar reseñas por libro y calcular promedio
    const ratingsMap = new Map<number, { total: number, count: number }>();
    resenasQuery.forEach(resena => {
      const libroId = typeof resena.libro === 'object' && 'id' in resena.libro 
        ? resena.libro.id 
        : resena.libro as number;
      
      if (!ratingsMap.has(libroId)) {
        ratingsMap.set(libroId, { total: 0, count: 0 });
      }
      const current = ratingsMap.get(libroId)!;
      current.total += resena.estrellas || 0;
      current.count += 1;
    });

    // Formatear respuesta para el frontend
    const libros = recomendaciones.map(({ libro, score }) => {
      // 🔥 FIX: Si el libro NO tiene slug, usar externalId o generar uno
      // IMPORTANTE: Priorizar externalId para libros de APIs externas
      let libroSlug: string;
      if (libro.slug) {
        // ✅ Si tiene slug en BD, usarlo directamente
        libroSlug = libro.slug;
      } else if (libro.externalId) {
        // ✅ Si tiene externalId (libro de API externa), usarlo como slug
        libroSlug = libro.externalId;
      } else {
        // ⚠️ Fallback: generar slug desde el nombre
        libroSlug = generateSlug(libro.nombre || `libro-${libro.id}`);
      }
      
      // Calcular rating promedio
      const ratingData = ratingsMap.get(libro.id);
      const averageRating = ratingData 
        ? Math.round((ratingData.total / ratingData.count) * 10) / 10
        : 0;
      
      return {
        id: libro.id, // ID interno para operaciones
        slug: libroSlug, // Slug para navegación (prioriza slug BD > externalId > generado)
        titulo: libro.nombre || 'Sin título',
        autores: libro.autor ? [`${libro.autor.nombre} ${libro.autor.apellido}`.trim()] : [],
        imagen: libro.imagen || null,
        descripcion: libro.sinopsis || null,
        averageRating, // ✅ Rating calculado desde reseñas
        score, // ✅ Score real del algoritmo (0-1)
        matchCategorias: libro.categoria ? [libro.categoria.nombre] : [],
        matchAutores: libro.autor ? [`${libro.autor.nombre} ${libro.autor.apellido}`.trim()] : [],
        esReciente: libro.createdAt ? 
          (new Date().getTime() - new Date(libro.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 : false
      };
    });

    res.json({ 
      libros,
      metadata: {
        algoritmo: 'Basado en favoritos, reseñas 4+ estrellas, categorías y autores preferidos',
        totalRecomendaciones: libros.length,
        usuarioId: usuario.id
      }
    });
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al obtener recomendaciones' 
    });
  }
};

/**
 * Invalida el caché de recomendaciones para el usuario autenticado
 * Útil después de agregar favoritos o reseñas
 */
export const invalidarCacheRecomendaciones = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;

    const usuarioPayload = (req as any).user;
    if (!usuarioPayload || typeof usuarioPayload === 'string' || !('id' in usuarioPayload)) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const recomendacionService = new RecomendacionService(orm);
    await recomendacionService.invalidarCache(usuarioPayload.id);

    res.json({ message: 'Caché de recomendaciones invalidado con éxito' });
  } catch (error) {
    console.error('Error al invalidar caché:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al invalidar caché' 
    });
  }
};
