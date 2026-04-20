// src/middleware/listaAuth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Lista } from '../entities/lista.entity';

export const authorizeListaOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const userId = (req as any).user.id; // Asumiendo que authenticateJWT añade 'user' al req

    // --- CAMBIO CLAVE AQUÍ ---
    // 1. Busca el ID en params, si no está, búscalo en body.
    const listaId = req.params.listaId || req.body.listaId;

    if (!listaId) {
      return res.status(400).json({ error: 'Falta el ID de la lista' });
    }

    const lista = await orm.em.findOne(Lista, { id: Number(listaId) }, { populate: ['usuario'] });

    if (!lista) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }

    // 2. Compara el propietario de la lista con el ID del usuario del token JWT
    if (lista.usuario.id !== userId) {
      return res.status(403).json({ error: 'Acceso denegado. No eres el propietario de esta lista.' });
    }

    // Pasa lista para evitar cargarla de nuevo
    (req as any).lista = lista;

    // Si todo está bien, pasa a la siguiente función (el controlador)
    next();
  } catch (error) {
    console.error("Error en authorizeListaOwner:", error);
    res.status(500).json({ error: 'Error interno del servidor durante la autorización' });
  }
};
