import { MikroORM } from '@mikro-orm/core';
import { Actividad, TipoActividad } from '../entities/actividad.entity';
import { Usuario } from '../entities/usuario.entity';
import { Libro } from '../entities/libro.entity';
import { Resena } from '../entities/resena.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
import { NotificacionService } from './notificacion.service';
import { TipoNotificacion } from '../entities/notificacion.entity';
import { redis } from '../redis';

export class ActividadService {
  constructor(private orm: MikroORM) {}

  async crearActividad(
    usuarioId: number,
    tipo: TipoActividad,
    libroId?: number,
    resenaId?: number,
    notificarSeguidores: boolean = true // Nuevo parámetro para controlar notificaciones
  ): Promise<Actividad> {
    const em = this.orm.em.fork();
    
    const usuario = await em.findOne(Usuario, { id: usuarioId });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    let libro = null;
    if (libroId) {
      // Cargar libro completo para poder usarlo en notificaciones
      libro = await em.findOne(Libro, { id: libroId });
    }

    let resena = null;
    if (resenaId) {
      resena = await em.findOne(Resena, { id: resenaId });
    }

    const actividad = em.create(Actividad, {
      usuario,
      tipo,
      libro,
      resena,
      fecha: new Date()
    });

    await em.persistAndFlush(actividad);

    // 🔔 Notificar a seguidores solo si está habilitado
    if (notificarSeguidores) {
      await this.notificarSeguidores(usuarioId, tipo, libro, usuario);
    }

    // 🗑️ Invalidar caché de feeds de los seguidores
    await this.invalidarCacheSeguidores(usuarioId);

    console.log(`✅ Actividad ${tipo} creada para usuario ${usuarioId}`);

    return actividad;
  }

  /**
   * Invalida el caché de feeds de los seguidores de un usuario
   */
  private async invalidarCacheSeguidores(usuarioId: number): Promise<void> {
    if (!redis) {
      console.log('⚠️ Redis no disponible, no se puede invalidar caché');
      return;
    }

    try {
      const em = this.orm.em.fork();
      
      // Obtener seguidores del usuario
      const seguidores = await em.find(Seguimiento, { seguido: usuarioId });

      // Invalidar caché de cada seguidor
      for (const seguimiento of seguidores) {
        // Invalidar directamente por IDs conocidos (diferentes combinaciones de paginación y filtros)
        const tipos = ['all', 'resena', 'favorito', 'lista', 'seguimiento'];
        for (const tipo of tipos) {
          for (let i = 0; i < 5; i++) {
            const key = `feed:usuario:${seguimiento.seguidor.id}:20:${i * 20}:${tipo}`;
            await redis.del(key);
          }
        }
        console.log(`🗑️ Caché de feed invalidado para seguidor ${seguimiento.seguidor.id}`);
      }
    } catch (error) {
      console.error('Error al invalidar caché de seguidores:', error);
      // No lanzar error para no interrumpir la creación de actividad
    }
  }

  /**
   * Notifica a los seguidores sobre una nueva actividad
   */
  private async notificarSeguidores(
    usuarioId: number,
    tipo: TipoActividad,
    libro: Libro | null,
    usuario: Usuario
  ): Promise<void> {
    try {
      const em = this.orm.em.fork();
      const notificacionService = new NotificacionService(em);

      console.log(`📢 Buscando seguidores del usuario ${usuarioId}...`);

      // Obtener seguidores del usuario
      const seguidores = await em.find(
        Seguimiento, 
        { seguido: usuarioId },
        { populate: ['seguidor'] }
      );

      console.log(`👥 Encontrados ${seguidores.length} seguidores para usuario ${usuarioId}`);

      if (seguidores.length === 0) return;

      // Crear mensaje según el tipo de actividad
      const nombreCompleto = usuario.nombre || usuario.username;
      let mensaje = '';
      let url = '';

      switch (tipo) {
        case TipoActividad.RESEÑA:
          if (libro) {
            mensaje = `${nombreCompleto} publicó una reseña de "${libro.nombre}"`;
            const libroSlug = libro.slug || libro.externalId || libro.id.toString();
            url = `/libro/${libroSlug}`;
            console.log(`🔔 Notificando reseña - Libro: ${libro.nombre}, Slug: ${libroSlug}`);
          } else {
            mensaje = `${nombreCompleto} publicó una nueva reseña`;
            url = `/perfil/${usuarioId}`;
          }
          break;

        case TipoActividad.FAVORITO:
          if (libro) {
            mensaje = `${nombreCompleto} agregó "${libro.nombre}" a favoritos`;
            const libroSlug = libro.slug || libro.externalId || libro.id.toString();
            url = `/libro/${libroSlug}`;
            console.log(`🔔 Notificando favorito - Libro: ${libro.nombre}, Slug: ${libroSlug}`);
          } else {
            mensaje = `${nombreCompleto} agregó un libro a favoritos`;
            url = `/perfil/${usuarioId}`;
          }
          break;

        case TipoActividad.LISTA:
          mensaje = `${nombreCompleto} actualizó una lista`;
          url = `/perfil/${usuarioId}`;
          break;

        case TipoActividad.REACCION:
          // No notificar reacciones (ya se notifican por otro medio)
          return;

        default:
          mensaje = `${nombreCompleto} tiene nueva actividad`;
          url = `/perfil/${usuarioId}`;
      }

      // Crear notificación para cada seguidor
      const notificaciones = seguidores.map(seguimiento =>
        notificacionService.crearNotificacion({
          usuarioId: seguimiento.seguidor.id,
          tipo: TipoNotificacion.ACTIVIDAD_SEGUIDO,
          mensaje,
          data: { usuarioId, tipo, libroId: libro?.id },
          url
        })
      );

      await Promise.all(notificaciones);
      console.log(`🔔 ${seguidores.length} notificaciones enviadas para actividad ${tipo} de usuario ${usuarioId}`);
    } catch (error) {
      console.error('Error al notificar seguidores:', error);
      // No lanzar error para no interrumpir la creación de actividad
    }
  }

  async crearActividadResena(usuarioId: number, resenaId: number): Promise<Actividad> {
    // Obtener la reseña para conseguir el libro asociado (con slug y externalId)
    const em = this.orm.em.fork();
    const resena = await em.findOne(Resena, { id: resenaId }, { 
      populate: ['libro', 'resenaPadre'],
      fields: ['id', 'libro.id', 'libro.nombre', 'libro.slug', 'libro.externalId', 'resenaPadre']
    });
    const libroId = resena?.libro?.id;
    const esRespuesta = !!resena?.resenaPadre;
    
    // Si es una respuesta, no notificar a seguidores (solo se notifica al autor de la reseña original)
    if (esRespuesta) {
      console.log('📝 Es una respuesta, no se notifica a seguidores');
      return this.crearActividad(usuarioId, TipoActividad.RESPUESTA, libroId, resenaId, false);
    }
    
    // Si es una reseña nueva, notificar a seguidores
    return this.crearActividad(usuarioId, TipoActividad.RESEÑA, libroId, resenaId, true);
  }

  async crearActividadFavorito(usuarioId: number, libroId: number): Promise<Actividad> {
    return this.crearActividad(usuarioId, TipoActividad.FAVORITO, libroId);
  }

  async crearActividadSeguimiento(usuarioId: number): Promise<Actividad> {
    return this.crearActividad(usuarioId, TipoActividad.SEGUIMIENTO);
  }

  async crearActividadLista(usuarioId: number): Promise<Actividad> {
    return this.crearActividad(usuarioId, TipoActividad.LISTA);
  }

  async crearActividadReaccion(usuarioId: number, resenaId: number): Promise<Actividad> {
    return this.crearActividad(usuarioId, TipoActividad.REACCION, undefined, resenaId);
  }
}
