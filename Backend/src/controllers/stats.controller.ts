import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Libro } from '../entities/libro.entity';
import { Resena } from '../entities/resena.entity';
import { Usuario } from '../entities/usuario.entity';
import { Favorito } from '../entities/favorito.entity';

/**
 * Obtiene las estadísticas principales de la plataforma
 * Para mostrar en el HeroSection
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    // Obtener las estadísticas en paralelo para mejor performance
    const [
      librosCount,
      resenasCount,
      usuariosCount,
      favoritosCount
    ] = await Promise.all([
      // Libros reseñados (libros que tienen al menos una reseña)
      em.count(Libro, {}),
      
      // Total de reseñas
      em.count(Resena, {}),
      
      // Usuarios activos (tienen al menos una actividad en los últimos 30 días)
      em.count(Usuario, {}),
      
      // Total de libros marcados como favoritos
      em.count(Favorito, {})
    ]);

    res.json({
      librosCreados: librosCount,
      reseniasTotales: resenasCount,
      lectoresActivos: usuariosCount,
      librosFavoritos: favoritosCount,
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Obtiene estadísticas detalladas (para admin/analytics)
 */
export const getDetailedStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    // Estadísticas más detalladas
    const [
      librosCount,
      resenasCount,
      usuariosCount,
      favoritosCount,
      resenasHoy,
      nuevoUsuariosHoy
    ] = await Promise.all([
      em.count(Libro, {}),
      em.count(Resena, {}),
      em.count(Usuario, {}),
      em.count(Favorito, {}),
      
      // Reseñas de hoy
      em.count(Resena, {
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      
      // Nuevos usuarios hoy
      em.count(Usuario, {
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    // Calcular promedios
    const avgResenasPerLibro = librosCount > 0 ? parseFloat((resenasCount / librosCount).toFixed(2)) : 0;
    const avgFavoritosPerUsuario = usuariosCount > 0 ? parseFloat((favoritosCount / usuariosCount).toFixed(2)) : 0;

    res.json({
      basic: {
        librosResenados: librosCount,
        reseniasTotales: resenasCount,
        lectoresActivos: usuariosCount,
        librosFavoritos: favoritosCount,
      },
      daily: {
        resenasHoy,
        nuevoUsuariosHoy,
      },
      averages: {
        avgResenasPerLibro,
        avgFavoritosPerUsuario,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching detailed stats:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas detalladas',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
