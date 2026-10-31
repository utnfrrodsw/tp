import { Request, Response } from 'express';

import { getUsuarioById, listEmpresasActivas, listUsuariosByRol, setUsuarioActivo } from '../services/usuario.service.js';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';
import { obtenerAuth } from '../../../middlewares/authorization.js';

// Devuelve los datos públicos de las empresas activas
export const getEmpresas = async (_req: Request, res: Response) => {
  try {
    const empresas = await listEmpresasActivas();

    res.json({
      empresas: empresas.map((e) => ({
        id: e.id,
        nombre: e.nombre,
        zona: e.zona,
        telefono: e.telefono
      }))
    });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener las empresas');
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  const rol = typeof req.query.rol === 'string' ? req.query.rol : undefined;

  try {
    const usuarios = await listUsuariosByRol(rol);

    res.json({
      usuarios: usuarios.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        zona: u.zona,
        cuit: u.cuit,
        telefono: u.telefono,
        activo: u.activo,
        creadoEn: u.creadoEn
      }))
    });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener los usuarios');
  }
};

// Devuelve el perfil del propio usuario logueado (lo usa la empresa para ver su plan)
export const getUsuario = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const auth = obtenerAuth(req);

  // Solo puede ver su propio perfil, salvo que sea administrador
  if (auth?.userId !== id && auth?.role !== 'administrador') {
    return respondWithError(res, 403, 'FORBIDDEN', 'No podés acceder a los datos de otro usuario');
  }

  try {
    const usuario = await getUsuarioById(id);

    if (!usuario) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Usuario no encontrado');
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        zona: usuario.zona,
        activo: usuario.activo,
        plan: usuario.plan,
        creadoEn: usuario.creadoEn
      }
    });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener el usuario');
  }
};

export const patchUsuarioActivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { activo } = req.body;

  try {
    const usuario = await setUsuarioActivo(id, activo);

    if (!usuario) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Usuario no encontrado');
    }

    res.json({
      message: activo ? 'Usuario reactivado correctamente' : 'Usuario suspendido correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
      }
    });
  } catch (error) {
    sendApiError(res, error, 'Error al actualizar el usuario');
  }
};
