import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Reaccion } from '../entities/reaccion.entity';
import { Resena } from '../entities/resena.entity';
import { Usuario } from '../entities/usuario.entity';
import { NotificacionService } from '../services/notificacion.service';

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const addOrUpdateReaccion = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { resenaId, tipo } = req.body;
    
    console.log('📝 Datos recibidos:', { resenaId, tipo, body: req.body });
    
    // Obtener usuarioId del token
    const usuarioPayload = (req as AuthRequest).user;
    if (!usuarioPayload) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const usuarioId = usuarioPayload.id;

    console.log('👤 Usuario autenticado:', usuarioId);

    if (!resenaId || !tipo) {
      return res.status(400).json({ error: 'Faltan datos requeridos: resenaId y tipo' });
    }

    // Validar tipo de reacción
    const tiposValidos = ['like', 'dislike', 'corazon'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de reacción inválido' });
    }

    console.log('🔍 Buscando reacción existente...');
    let reaccion = await em.findOne(Reaccion, {
      usuario: usuarioId,
      resena: resenaId,
    });

    console.log('📊 Reacción encontrada:', reaccion ? `ID: ${reaccion.id}` : 'No existe');

    let esNueva = false;

    if (reaccion) {
      // Actualizar reacción existente
      console.log('🔄 Actualizando reacción existente');
      reaccion.tipo = tipo;
      reaccion.fecha = new Date();
    } else {
      // Crear nueva reacción - necesitamos las referencias de entidades
      console.log('✨ Creando nueva reacción');
      const usuario = em.getReference(Usuario, usuarioId);
      const resena = em.getReference(Resena, resenaId);
      
      reaccion = em.create(Reaccion, {
        usuario,
        resena,
        tipo,
        fecha: new Date(),
      });
      esNueva = true;
    }

    console.log('💾 Persistiendo reacción...');
    await em.persistAndFlush(reaccion);
    console.log('✅ Reacción guardada con ID:', reaccion.id);

    // Recargar la reacción con sus relaciones para devolverla correctamente
    await em.populate(reaccion, ['usuario', 'resena']);

    // Enviar notificación solo para nuevas reacciones
    if (esNueva) {
      try {
        // Obtener información de la reseña y el libro para la notificación
        const resena = await em.findOne(Resena, { id: resenaId }, { 
          populate: ['usuario', 'libro'],
          fields: ['id', 'usuario', 'libro.id', 'libro.nombre', 'libro.slug', 'libro.externalId']
        });
        
        if (resena && resena.usuario.id !== usuarioId) {
          // Solo notificar si no es tu propia reseña
          const usuarioReaccion = await em.findOne(Usuario, { id: usuarioId });
          
          if (usuarioReaccion && resena.libro) {
            const notificacionService = new NotificacionService(em);
            
            // Mapear tipo de reacción a formato esperado
            const tipoMayuscula = tipo.toUpperCase();
            
            // Usar slug o externalId del libro para la URL, fallback a ID
            const libroSlug = resena.libro.slug || resena.libro.externalId || resena.libro.id.toString();
            
            console.log(`🔔 Creando notificación de reacción - Libro: ${resena.libro.nombre}, Slug: ${libroSlug}`);
            
            await notificacionService.notificarNuevaReaccion(
              resena.usuario.id,
              usuarioReaccion.username || 'Alguien',
              tipoMayuscula,
              resenaId,
              resena.libro.nombre || 'Libro sin título',
              libroSlug
            );
          }
        }
      } catch (notifError) {
        console.error('Error al crear notificación de reacción:', notifError);
        // No fallar la creación de la reacción si falla la notificación
      }
    }

    res.status(esNueva ? 201 : 200).json(reaccion);
  } catch (error) {
    console.error('Error en addOrUpdateReaccion:', error);
    res.status(500).json({ error: 'Error al procesar la reacción' });
  }
};

export const getReaccionesByResena = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const resenaId = +req.params.resenaId;

    if (isNaN(resenaId)) {
      return res.status(400).json({ error: 'ID de reseña inválido' });
    }

    const reacciones = await em.find(
      Reaccion, 
      { resena: resenaId }, 
      { populate: ['usuario'] }
    );
    
    res.json(reacciones);
  } catch (error) {
    console.error('Error en getReaccionesByResena:', error);
    res.status(500).json({ error: 'Error al obtener reacciones' });
  }
};

export const deleteReaccion = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { usuarioId, resenaId } = req.params;
    
    // Verificar autenticación
    const usuarioPayload = (req as AuthRequest).user;
    if (!usuarioPayload) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Validar que el usuario solo pueda eliminar sus propias reacciones
    if (usuarioPayload.id !== +usuarioId) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta reacción' });
    }

    const reaccion = await em.findOne(Reaccion, {
      usuario: +usuarioId,
      resena: +resenaId,
    });

    if (!reaccion) {
      return res.status(404).json({ error: 'Reacción no encontrada' });
    }

    await em.removeAndFlush(reaccion);
    res.json({ mensaje: 'Reacción eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteReaccion:', error);
    res.status(500).json({ error: 'Error al eliminar la reacción' });
  }
};
