import { Request, Response } from 'express';
import { Servicio } from './servicio.entity.js';
import { orm } from '../shared/db/orm.js';
import { lookUserTipoServicio } from '../usuario/usuario.controler.js';

const em = orm.em;

// Find all services
async function findall(req: Request, res: Response) {
  try {
    const services = await em.find(
      Servicio,
      {},
      { populate: ['usuario', 'tarea', 'turnos'] }
    );
    res.status(200).json({ message: 'found all services', data: services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Find one service by ID
async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(
      Servicio,
      { id },
      { populate: ['usuario', 'tarea', 'turnos'] }
    );
    res.status(200).json({ message: 'found one service', data: service });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Servicio no encontrado',
      });
    }
    res.status(500).json({ message: error.message });
  }
}

// Add a new service
async function add(req: Request, res: Response) {
  try {
    const servicioData = req.body;
    const service = em.create(Servicio, servicioData);
    await em.persistAndFlush(service);
    res.status(201).json({ message: 'created service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update an existing service
async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const service = await em.findOneOrFail(Servicio, {
      id: Number.parseInt(id),
    });
    em.assign(service, updateData);
    await em.persistAndFlush(service);
    res.status(200).json({ message: 'updated service', data: service });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Servicio no encontrado',
      });
    }
    res.status(500).json({ message: error.message });
  }
}

// Remove a service
async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const service = await em.findOneOrFail(Servicio, {
      id: Number.parseInt(id),
    });
    await em.removeAndFlush(service);
    res.status(200).json({ message: 'removed service', data: service });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Servicio no encontrado',
      });
    }
    res.status(500).json({ message: error.message });
  }
}

async function getServicebyids(req: Request) {
  try {
    const ids = req.body.ids;
    return getServiceByServiceIds(ids);
  } catch (error: any) {
    throw error;
  }
}

async function getServiceByServiceIds(ids: number[]) {
  try {
    const services = await em.find(
      Servicio,
      { id: ids },
      { populate: ['tarea', 'usuario'] }
    );
    return services;
  } catch (error: any) {
    throw error;
  }
}

async function getById(id: number) {
  try {
    const service = await em.findOneOrFail(
      Servicio,
      { id },
      { populate: ['tarea', 'usuario'] }
    );
    return service;
  } catch (error: any) {
    throw error;
  }
}

// Obtener servicios por usuario
async function getByUser(req: Request, res: Response) {
  try {
    const { usuarioId } = req.params;
    const usuarioIdNum = Number.parseInt(usuarioId);

    if (!usuarioIdNum) {
      return res.status(400).json({
        message: 'usuarioId es requerido',
      });
    }

    const servicios = await em.find(
      Servicio,
      {
        usuario: usuarioIdNum,
      },
      {
        populate: ['tarea', 'tarea.tipoServicio', 'usuario'],
      }
    );

    res.status(200).json({
      message: 'Servicios encontrados',
      data: servicios,
    });
  } catch (error: any) {
    console.error('Error en getByUser:', error);
    res.status(500).json({ message: error.message });
  }
}

// Crear o actualizar servicio por usuario y tarea
async function upsertByUserAndTask(req: Request, res: Response) {
  try {
    const { tareaId, usuarioId, precio } = req.body;

    if (!tareaId || !usuarioId || !precio || precio <= 0) {
      return res.status(400).json({
        message: 'tareaId, usuarioId y precio (>0) son requeridos',
      });
    }

    // Buscar si ya existe un servicio con esta combinación
    const servicioExistente = await em.findOne(Servicio, {
      tarea: tareaId,
      usuario: usuarioId,
    });

    if (servicioExistente) {
      // Actualizar precio del servicio existente y reactivarlo
      servicioExistente.precio = precio;
      servicioExistente.estado = 'activo';
      await em.persistAndFlush(servicioExistente);
      await lookUserTipoServicio(Number(usuarioId), Number(tareaId), true);
      res.status(200).json({
        message: 'Servicio actualizado',
        data: servicioExistente,
        action: 'updated',
      });
    } else {
      // Crear nuevo servicio
      const nuevoServicio = em.create(Servicio, {
        precio,
        tarea: tareaId,
        usuario: usuarioId,
        estado: 'activo',
      });
      await em.persistAndFlush(nuevoServicio);
      // ==============================================================================================================================
      // Aca si no hay alguna tarea con ese tipo ebe agregarlo al usuario.
      // ==============================================================================================================================
      await lookUserTipoServicio(Number(usuarioId), Number(tareaId), true); // TODO: Reemplaza 'true' con el tercer argumento correcto si es necesario
      res.status(201).json({
        message: 'Servicio creado',
        data: nuevoServicio,
        action: 'created',
      });
    }
  } catch (error: any) {
    console.error('Error en upsertByUserAndTask:', error);
    res.status(500).json({ message: error.message });
  }
}

// Eliminar servicio por usuario y tarea
async function deleteByUserAndTask(req: Request, res: Response) {
  try {
    const { tareaId, usuarioId } = req.params;

    if (!tareaId || !usuarioId) {
      return res.status(400).json({
        message: 'tareaId y usuarioId son requeridos',
      });
    }

    const servicio = await em.findOne(Servicio, {
      tarea: Number(tareaId),
      usuario: Number(usuarioId),
    });

    if (!servicio) {
      return res.status(404).json({
        message: 'Servicio no encontrado',
      });
    }

    await em.removeAndFlush(servicio);
    res.status(200).json({
      message: 'Servicio eliminado exitosamente',
    });
  } catch (error: any) {
    console.error('Error en deleteByUserAndTask:', error);
    res.status(500).json({ message: error.message });
  }
}

// Desactivar servicio por usuario y tarea (cambiar estado a inactivo)
async function deactivateByUserAndTask(req: Request, res: Response) {
  try {
    const { tareaId, usuarioId } = req.params;

    if (!tareaId || !usuarioId) {
      return res.status(400).json({
        message: 'tareaId y usuarioId son requeridos',
      });
    }

    const servicio = await em.findOne(Servicio, {
      tarea: Number(tareaId),
      usuario: Number(usuarioId),
    });

    if (!servicio) {
      return res.status(404).json({
        message: 'Servicio no encontrado',
      });
    }

    // Cambiar estado a inactivo en lugar de eliminar
    servicio.estado = 'inactivo';
    await em.persistAndFlush(servicio);
    //Elimina la relación con ese tipo de servicio si no tiene más servicios con ese tipo
    await lookUserTipoServicio(Number(usuarioId), Number(tareaId), false);
    res.status(200).json({
      message: 'Servicio desactivado exitosamente',
      data: servicio,
    });
  } catch (error: any) {
    console.error('Error en deactivateByUserAndTask:', error);
    res.status(500).json({ message: error.message });
  }
}

export {
  findall,
  findone,
  getById,
  add,
  update,
  remove,
  getServicebyids,
  getServiceByServiceIds,
  getByUser,
  upsertByUserAndTask,
  deleteByUserAndTask,
  deactivateByUserAndTask,
};
