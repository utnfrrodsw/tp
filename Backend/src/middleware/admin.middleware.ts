import { Request, Response, NextFunction } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { AuthRequest } from './auth.middleware';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const usuario = await orm.em.findOne(Usuario, { id: userId });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.rol !== RolUsuario.ADMIN) {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
