// src/utils/resenaHelpers.ts
import { Resena, EstadoResena } from '../entities/resena.entity';
import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { EntityManager } from '@mikro-orm/core';

/**
 * Construye el where clause para buscar reseñas
 */
export function buildResenaWhereClause(params: {
  libroId?: string;
  libroMatch?: string;
  libroSource?: string;
  includeFlagged?: string;
  usuarioId?: string;
  estado?: string;
  user?: any;
  em: EntityManager;
}): any {
  const { libroId, libroMatch, libroSource, includeFlagged, usuarioId, estado, user } = params;
  const where: any = {};

  // Excluir reseñas eliminadas (soft delete)
  where.deletedAt = null;

  // Filtrado por libroId
  if (libroId) {
    const libroIdStr = libroId.toString();
    const isNumeric = /^\d+$/.test(libroIdStr);

    if (libroMatch === 'id' && isNumeric) {
      where.libro = { id: +libroIdStr };
    } else if (libroMatch === 'externalId') {
      where.libro = libroSource
        ? { externalId: libroIdStr, source: libroSource }
        : { externalId: libroIdStr };
    } else if (isNumeric) {
      where.libro = { $or: [{ id: +libroIdStr }, { externalId: libroIdStr }] };
    } else {
      where.libro = libroSource
        ? { externalId: libroIdStr, source: libroSource }
        : { externalId: libroIdStr };
    }
  }

  // Filtrado por usuarioId
  if (usuarioId) {
    where.usuario = +usuarioId;
  }

  // Filtrado por estado
  if (estado) {
    // Normalizar estado a enum value
    const estadoNormalizado = estado.toLowerCase();
    
    if (estadoNormalizado === 'pendiente' || estadoNormalizado === 'pending') {
      // Para moderación se puede incluir flagged; para conteos específicos puede excluirse.
      const shouldIncludeFlagged = includeFlagged !== 'false';
      where.estado = shouldIncludeFlagged
        ? { $in: [EstadoResena.PENDING, EstadoResena.FLAGGED] }
        : EstadoResena.PENDING;
    } else if (estadoNormalizado === 'aprobada' || estadoNormalizado === 'approved') {
      where.estado = EstadoResena.APPROVED;
    } else if (estadoNormalizado === 'rechazada' || estadoNormalizado === 'rejected') {
      where.estado = EstadoResena.REJECTED;
    } else if (estadoNormalizado === 'flagged') {
      where.estado = EstadoResena.FLAGGED;
    } else {
      // Si viene directamente como enum, usarlo
      where.estado = estado;
    }
  }

  // Lógica de visibilidad según usuario y contexto
  if (!estado) {
    if (libroId) {
      // Mostrar todas excepto rechazadas
      where.estado = { $nin: [EstadoResena.FLAGGED] };
    } else {
      // Para listas generales, solo aprobadas para no-admin
      if (!user) {
        where.estado = EstadoResena.APPROVED;
      }
    }
  }

  return where;
}

/**
 * Verifica si el usuario es admin
 */
export async function isUserAdmin(userId: number, em: EntityManager): Promise<boolean> {
  const usuario = await em.findOne(Usuario, { id: userId });
  return usuario?.rol === RolUsuario.ADMIN;
}

/**
 * Agrega contadores de reacciones a una reseña
 */
export function agregarContadoresReacciones(resena: Resena): void {
  const reacciones = resena.reacciones.getItems();
  (resena as any).reaccionesCount = {
    likes: reacciones.filter(r => r.tipo === 'like').length,
    dislikes: reacciones.filter(r => r.tipo === 'dislike').length,
    corazones: reacciones.filter(r => r.tipo === 'corazon').length,
    total: reacciones.length
  };
}

/**
 * Procesa reseñas agregando contadores a ellas y sus respuestas
 */
export function procesarResenasConContadores(resenas: Resena[]): void {
  resenas.forEach(resena => {
    agregarContadoresReacciones(resena);
    resena.respuestas?.getItems().forEach(agregarContadoresReacciones);
  });
}

/**
 * Serializa una reseña para respuesta de moderación
 */
export function serializarResenaModeracion(resena: Resena): any {
  return {
    id: resena.id,
    comentario: resena.comentario,
    estrellas: resena.estrellas,
    estado: resena.estado,
    fechaResena: resena.fechaResena,
    moderationScore: resena.moderationScore,
    moderationReasons: resena.moderationReasons,
    autoModerated: resena.autoModerated,
    usuario: {
      id: resena.usuario.id,
      nombre: resena.usuario.nombre,
      username: resena.usuario.username,
      email: resena.usuario.email,
      avatar: resena.usuario.avatar
    },
    libro: resena.libro ? {
      id: resena.libro.id,
      nombre: resena.libro.nombre,
      externalId: resena.libro.externalId,
      slug: resena.libro.externalId
    } : null
  };
}

/**
 * Serializa una reseña completa con todas sus relaciones
 */
export function serializarResenaCompleta(resena: any, includeParent = false): any {
  // Extraer reacciones
  let reaccionesArray: any[] = [];
  if (resena.reacciones) {
    // Check if it's a MikroORM Collection and if it's initialized
    if (typeof resena.reacciones.isInitialized === 'function' && !resena.reacciones.isInitialized()) {
      // Collection exists but not loaded - skip it
      reaccionesArray = [];
    } else if (typeof resena.reacciones.getItems === 'function') {
      reaccionesArray = resena.reacciones.getItems();
    } else if (Array.isArray(resena.reacciones)) {
      reaccionesArray = resena.reacciones;
    }
  }
  
  // Extraer respuestas
  let respuestasArray: any[] = [];
  if (resena.respuestas) {
    // Check if it's a MikroORM Collection and if it's initialized
    if (typeof resena.respuestas.isInitialized === 'function' && !resena.respuestas.isInitialized()) {
      // Collection exists but not loaded - skip it
      respuestasArray = [];
    } else if (typeof resena.respuestas.getItems === 'function') {
      respuestasArray = resena.respuestas.getItems();
    } else if (Array.isArray(resena.respuestas)) {
      respuestasArray = resena.respuestas;
    }
  }
  
  // Calcular contadores
  const reaccionesCount = {
    likes: reaccionesArray.filter((r: any) => r.tipo === 'like').length,
    dislikes: reaccionesArray.filter((r: any) => r.tipo === 'dislike').length,
    corazones: reaccionesArray.filter((r: any) => r.tipo === 'corazon').length,
    total: reaccionesArray.length
  };
  
  return {
    id: resena.id,
    comentario: resena.comentario,
    estrellas: resena.estrellas,
    estado: resena.estado,
    fechaResena: resena.fechaResena,
    createdAt: resena.createdAt,
    updatedAt: resena.updatedAt,
    usuario: {
      id: resena.usuario?.id,
      nombre: resena.usuario?.nombre,
      username: resena.usuario?.username,
      email: resena.usuario?.email,
      avatar: resena.usuario?.avatar
    },
    libro: resena.libro ? {
      id: resena.libro.id,
      nombre: resena.libro.nombre,
      externalId: resena.libro.externalId,
      imagen: resena.libro.imagen,
      autor: resena.libro.autor ? {
        id: resena.libro.autor.id,
        nombre: resena.libro.autor.nombre
      } : null
    } : null,
    reacciones: reaccionesArray.map((r: any) => ({
      id: r.id,
      tipo: r.tipo,
      usuarioId: r.usuario?.id || r.usuario,
      fecha: r.fecha
    })),
    reaccionesCount,
    // Recursivamente serializar respuestas
    respuestas: respuestasArray.map(resp => serializarResenaCompleta(resp, false)),
    // Solo incluir resenaPadre si se solicita
    resenaPadre: includeParent && resena.resenaPadre ? {
      id: resena.resenaPadre.id,
      comentario: resena.resenaPadre.comentario,
      usuario: {
        id: resena.resenaPadre.usuario?.id,
        username: resena.resenaPadre.usuario?.username
      }
    } : undefined
  };
}

/**
 * Ordena respuestas recursivamente por fecha
 */
export function ordenarRespuestasPorFecha(resena: Resena): void {
  if (resena.respuestas && resena.respuestas.isInitialized()) {
    const sortedReplies = resena.respuestas
      .getItems()
      .sort((a, b) => new Date(a.fechaResena).getTime() - new Date(b.fechaResena).getTime());
    
    resena.respuestas.set(sortedReplies);
    sortedReplies.forEach(ordenarRespuestasPorFecha);
  }
}

/**
 * Filtra y ordena reseñas de nivel superior (sin padre)
 */
export function filtrarYOrdenarResenasTopLevel(resenas: Resena[]): Resena[] {
  const topLevel = resenas.filter(r => !r.resenaPadre);
  
  // Ordenar por fecha de creación descendente
  const sorted = topLevel.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Ordenar respuestas de cada reseña
  sorted.forEach(ordenarRespuestasPorFecha);
  
  return sorted;
}

/**
 * Pagina un array de reseñas
 */
export function paginarResenas(resenas: Resena[], page: number, limit: number): Resena[] {
  const offset = (page - 1) * limit;
  return resenas.slice(offset, offset + limit);
}
