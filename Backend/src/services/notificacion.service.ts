import { EntityManager } from '@mikro-orm/core';
import { Notificacion, TipoNotificacion } from '../entities/notificacion.entity';
import { Usuario } from '../entities/usuario.entity';

interface CrearNotificacionData {
  usuarioId: number;
  tipo: TipoNotificacion;
  mensaje: string;
  data?: any;
  url?: string;
}

export class NotificacionService {
  constructor(private em: EntityManager) {}

  /**
   * Crear una nueva notificación
   */
  async crearNotificacion(data: CrearNotificacionData): Promise<Notificacion> {
    const usuario = await this.em.findOneOrFail(Usuario, { id: data.usuarioId });

    console.log(`🔔 Creando notificación para usuario ${data.usuarioId}: ${data.mensaje}`);

    const notificacion = this.em.create(Notificacion, {
      usuario,
      tipo: data.tipo,
      mensaje: data.mensaje,
      data: data.data,
      url: data.url,
      leida: false,
      createdAt: new Date()
    });

    await this.em.persistAndFlush(notificacion);
    console.log(`✅ Notificación creada con ID: ${notificacion.id}`);
    return notificacion;
  }

  /**
   * Obtener notificaciones de un usuario
   */
  async obtenerNotificaciones(usuarioId: number, limit: number = 20): Promise<Notificacion[]> {
    return this.em.find(
      Notificacion,
      { usuario: usuarioId },
      {
        orderBy: { createdAt: 'DESC' },
        limit
      }
    );
  }

  /**
   * Contar notificaciones no leídas
   */
  async contarNoLeidas(usuarioId: number): Promise<number> {
    return this.em.count(Notificacion, {
      usuario: usuarioId,
      leida: false
    });
  }

  /**
   * Marcar notificación como leída
   */
  async marcarComoLeida(notificacionId: number, usuarioId: number): Promise<void> {
    const notificacion = await this.em.findOne(Notificacion, {
      id: notificacionId,
      usuario: usuarioId
    });

    if (notificacion) {
      notificacion.leida = true;
      await this.em.persistAndFlush(notificacion);
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas(usuarioId: number): Promise<void> {
    const notificaciones = await this.em.find(Notificacion, {
      usuario: usuarioId,
      leida: false
    });

    notificaciones.forEach(n => n.leida = true);
    await this.em.flush();
  }

  /**
   * Eliminar notificación
   */
  async eliminarNotificacion(notificacionId: number, usuarioId: number): Promise<void> {
    const notificacion = await this.em.findOne(Notificacion, {
      id: notificacionId,
      usuario: usuarioId
    });

    if (notificacion) {
      await this.em.removeAndFlush(notificacion);
    }
  }

  /**
   * Eliminar notificaciones antiguas (más de 30 días)
   */
  async limpiarNotificacionesAntiguas(): Promise<number> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const notificaciones = await this.em.find(Notificacion, {
      createdAt: { $lt: fechaLimite },
      leida: true
    });

    const count = notificaciones.length;
    await this.em.removeAndFlush(notificaciones);
    return count;
  }

  // ============================================
  // Métodos auxiliares para crear notificaciones específicas
  // ============================================

  /**
   * Notificar cuando alguien sigue al usuario
   */
  async notificarNuevoSeguidor(usuarioSeguidoId: number, seguidorNombre: string, seguidorId: number): Promise<void> {
    await this.crearNotificacion({
      usuarioId: usuarioSeguidoId,
      tipo: TipoNotificacion.NUEVO_SEGUIDOR,
      mensaje: `${seguidorNombre} comenzó a seguirte`,
      data: { seguidorId },
      url: `/perfil/${seguidorId}`
    });
  }

  /**
   * Notificar cuando alguien reacciona a tu reseña
   */
  async notificarNuevaReaccion(
    autorResenaId: number,
    usuarioReaccionNombre: string,
    tipoReaccion: string,
    resenaId: number,
    libroTitulo: string,
    libroSlug?: string
  ): Promise<void> {
    const emojis: Record<string, string> = {
      LIKE: '👍',
      DISLIKE: '👎',
      CORAZON: '❤️'
    };

    // Usar slug si está disponible, si no usar el ID de la reseña
    const url = libroSlug ? `/libro/${libroSlug}` : `/libro/${resenaId}`;

    await this.crearNotificacion({
      usuarioId: autorResenaId,
      tipo: TipoNotificacion.NUEVA_REACCION,
      mensaje: `${usuarioReaccionNombre} reaccionó ${emojis[tipoReaccion] || ''} a tu reseña de "${libroTitulo}"`,
      data: { resenaId, tipoReaccion },
      url
    });
  }

  /**
   * Notificar cuando un usuario que sigues publica una reseña
   */
  async notificarActividadSeguido(
    seguidorId: number,
    usuarioNombre: string,
    libroTitulo: string,
    libroId: number,
    libroSlug?: string
  ): Promise<void> {
    // Usar slug si está disponible, si no usar el ID
    const url = libroSlug ? `/libro/${libroSlug}` : `/libro/${libroId}`;
    
    await this.crearNotificacion({
      usuarioId: seguidorId,
      tipo: TipoNotificacion.ACTIVIDAD_SEGUIDO,
      mensaje: `${usuarioNombre} publicó una reseña de "${libroTitulo}"`,
      data: { libroId },
      url
    });
  }

  /**
   * Notificar cuando alguien responde a tu reseña
   */
  async notificarRespuestaResena(
    autorResenaOriginalId: number,
    usuarioRespuestaNombre: string,
    libroTitulo: string,
    resenaId: number,
    libroSlug?: string
  ): Promise<void> {
    console.log('📨 notificarRespuestaResena llamado con:', {
      autorResenaOriginalId,
      usuarioRespuestaNombre,
      libroTitulo,
      resenaId,
      libroSlug
    });
    
    // Usar slug si está disponible, si no usar el ID de la reseña
    const url = libroSlug ? `/libro/${libroSlug}` : `/libro/${resenaId}`;
    
    console.log('🔗 URL de notificación:', url);
    
    await this.crearNotificacion({
      usuarioId: autorResenaOriginalId,
      tipo: TipoNotificacion.RESPUESTA_RESENA,
      mensaje: `${usuarioRespuestaNombre} respondió a tu reseña de "${libroTitulo}"`,
      data: { resenaId },
      url
    });
    
    console.log('✅ notificarRespuestaResena completado');
  }

  /**
   * Notificar cuando un administrador rechaza una reseña
   */
  async notificarResenaRechazada(
    autorResenaId: number,
    libroTitulo: string,
    resenaId: number,
    libroSlug?: string,
    comentarioModerador?: string
  ): Promise<void> {
    const url = libroSlug ? `/libro/${libroSlug}` : `/resenas/${resenaId}`;
    const comentarioLimpio = (comentarioModerador || '').trim();
    const comentarioBreve = comentarioLimpio.length > 140
      ? `${comentarioLimpio.slice(0, 137)}...`
      : comentarioLimpio;

    const mensajeBase = `Tu reseña de "${libroTitulo}" no pudo publicarse.`;
    const mensaje = comentarioBreve
      ? `${mensajeBase} Comentario del equipo: ${comentarioBreve}`
      : mensajeBase;

    await this.crearNotificacion({
      usuarioId: autorResenaId,
      tipo: TipoNotificacion.RESENA_RECHAZADA,
      mensaje,
      data: { resenaId, comentarioModerador: comentarioBreve || undefined },
      url
    });
  }
}
