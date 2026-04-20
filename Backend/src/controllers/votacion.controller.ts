// src/controllers/votacion.controller.ts
import { Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { VotacionLibro, TipoVoto } from '../entities/votacionLibro.entity';
import { Libro } from '../entities/libro.entity';
import { Usuario } from '../entities/usuario.entity';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Votar por un libro (positivo o negativo)
 */
export const votarLibro = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { libroId, voto } = req.body;

    if (!libroId || !voto) {
      return res.status(400).json({ error: 'libroId y voto son requeridos' });
    }

    if (voto !== 'positivo' && voto !== 'negativo') {
      return res.status(400).json({ error: 'El voto debe ser "positivo" o "negativo"' });
    }

    // Verificar que el libro existe
    const libro = await em.findOne(Libro, { id: libroId });
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Verificar que el usuario existe
    const usuario = await em.findOne(Usuario, { id: usuarioId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar si ya existe un voto
    const votacionExistente = await em.findOne(VotacionLibro, {
      usuario: usuarioId,
      libro: libroId,
    });

    if (votacionExistente) {
      // Si el voto es el mismo, no hacer nada
      if (votacionExistente.voto === voto) {
        return res.json({
          message: 'Voto ya registrado',
          votacion: {
            id: votacionExistente.id,
            voto: votacionExistente.voto,
            fechaVoto: votacionExistente.fechaVoto,
          },
        });
      }

      // Si el voto es diferente, actualizarlo
      votacionExistente.voto = voto as TipoVoto;
      votacionExistente.fechaVoto = new Date();
      await em.persistAndFlush(votacionExistente);

      return res.json({
        message: 'Voto actualizado exitosamente',
        votacion: {
          id: votacionExistente.id,
          voto: votacionExistente.voto,
          fechaVoto: votacionExistente.fechaVoto,
        },
      });
    }

    // Crear nuevo voto
    const nuevaVotacion = em.create(VotacionLibro, {
      usuario,
      libro,
      voto: voto as TipoVoto,
      fechaVoto: new Date(),
    });

    await em.persistAndFlush(nuevaVotacion);

    res.status(201).json({
      message: 'Voto registrado exitosamente',
      votacion: {
        id: nuevaVotacion.id,
        voto: nuevaVotacion.voto,
        fechaVoto: nuevaVotacion.fechaVoto,
      },
    });
  } catch (error) {
    console.error('Error al votar:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al registrar el voto',
    });
  }
};

/**
 * Eliminar voto de un libro
 */
export const eliminarVoto = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { libroId } = req.params;

    const votacion = await em.findOne(VotacionLibro, {
      usuario: usuarioId,
      libro: Number(libroId),
    });

    if (!votacion) {
      return res.status(404).json({ error: 'Voto no encontrado' });
    }

    await em.removeAndFlush(votacion);

    res.json({ message: 'Voto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar voto:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al eliminar el voto',
    });
  }
};

/**
 * Obtener voto del usuario para un libro específico
 */
export const obtenerVotoUsuario = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { libroId } = req.params;

    const votacion = await em.findOne(VotacionLibro, {
      usuario: usuarioId,
      libro: Number(libroId),
    });

    if (!votacion) {
      return res.json({ voto: null });
    }

    res.json({
      voto: votacion.voto,
      fechaVoto: votacion.fechaVoto,
    });
  } catch (error) {
    console.error('Error al obtener voto:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al obtener el voto',
    });
  }
};

/**
 * Obtener estadísticas de votación de un libro
 */
export const obtenerEstadisticasLibro = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    
    const { libroId } = req.params;

    const libro = await em.findOne(Libro, { id: Number(libroId) });
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    const votaciones = await em.find(VotacionLibro, { libro: libro.id });

    const positivos = votaciones.filter(v => v.voto === TipoVoto.POSITIVO).length;
    const negativos = votaciones.filter(v => v.voto === TipoVoto.NEGATIVO).length;
    const total = votaciones.length;

    const porcentajePositivos = total > 0 ? Math.round((positivos / total) * 100) : 0;
    const porcentajeNegativos = total > 0 ? Math.round((negativos / total) * 100) : 0;

    res.json({
      libroId: Number(libroId),
      total,
      positivos,
      negativos,
      porcentajePositivos,
      porcentajeNegativos,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
    });
  }
};

/**
 * Obtener libros más votados (top votados positivamente)
 */
export const obtenerLibrosMasVotados = async (req: AuthRequest, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    
    const limit = Number(req.query.limit) || 10;

    // Obtener todos los libros con sus votaciones
    const votaciones = await em.find(VotacionLibro, {}, { populate: ['libro'] });

    // Agrupar votaciones por libro
    const votacionesPorLibro = new Map<number, { positivos: number; negativos: number; libro: Libro }>();

    votaciones.forEach(votacion => {
      const libroId = votacion.libro.id;
      
      if (!votacionesPorLibro.has(libroId)) {
        votacionesPorLibro.set(libroId, {
          positivos: 0,
          negativos: 0,
          libro: votacion.libro,
        });
      }

      const stats = votacionesPorLibro.get(libroId)!;
      if (votacion.voto === TipoVoto.POSITIVO) {
        stats.positivos++;
      } else {
        stats.negativos++;
      }
    });

    // Convertir a array y calcular puntuación
    const librosConVotacion = Array.from(votacionesPorLibro.entries()).map(([libroId, stats]) => ({
      libro: stats.libro,
      positivos: stats.positivos,
      negativos: stats.negativos,
      total: stats.positivos + stats.negativos,
      puntuacion: stats.positivos - stats.negativos, // Votos positivos menos negativos
      porcentajePositivos: Math.round((stats.positivos / (stats.positivos + stats.negativos)) * 100),
    }));

    // Ordenar por puntuación descendente
    librosConVotacion.sort((a, b) => b.puntuacion - a.puntuacion);

    // Tomar los top N
    const topLibros = librosConVotacion.slice(0, limit);

    res.json(topLibros);
  } catch (error) {
    console.error('Error al obtener libros más votados:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al obtener libros más votados',
    });
  }
};
