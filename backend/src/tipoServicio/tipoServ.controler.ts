import { NextFunction, Request, Response } from 'express';
import { TipoServicio } from './tipoServ.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;

async function findAll(_req: Request, res: Response) {
  try {
    const types = await em.find(
      TipoServicio,
      {},
      { populate: ['users', 'tareas'] }
    );
    res.status(200).json({ message: 'found all services', data: types });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllWithTareas(_req: Request, res: Response) {
  try {
    const types = await em.find(TipoServicio, {}, { populate: ['tareas'] });
    res.status(200).json({ message: 'found all services', data: types });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const serviceType = await em.findOneOrFail(
      TipoServicio,
      { id }
      //j́{ populate: ['users'] }
    );
    res.status(200).json({ message: 'found service type', data: serviceType });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const {
      nombreTipo,
      descripcionTipo,
      usuarios = [],
      tareas = [],
    } = req.body;
    const serviceType = em.create(TipoServicio, {
      nombreTipo,
      descripcionTipo,
      users: usuarios,
      tareas,
    });
    await em.flush();
    res
      .status(201)
      .json({ message: 'Service type created', data: serviceType });
  } catch (error: any) {
    console.error('Error en POST:', error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const serviceTypeToUpdate = await em.findOneOrFail(TipoServicio, { id });

    // Solo asigna los campos que están definidos en el cuerpo de la solicitud
    if (req.body.nombreTipo !== undefined) {
      serviceTypeToUpdate.nombreTipo = req.body.nombreTipo;
    }
    if (req.body.descripcionTipo !== undefined) {
      serviceTypeToUpdate.descripcionTipo = req.body.descripcionTipo;
    }
    if (req.body.usuarios !== undefined) {
      serviceTypeToUpdate.users.set(req.body.usuarios);
    }
    if (req.body.tareas !== undefined) {
      serviceTypeToUpdate.tareas.set(req.body.tareas);
    }

    await em.flush();
    res
      .status(200)
      .json({ message: 'Service type updated', data: serviceTypeToUpdate });
  } catch (error: any) {
    console.error('Error en PATCH:', error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const emFork = orm.em.fork(); //Aseguramos que si la operación falla, no se afecte el contexto de persistencia original
  try {
    const id = Number.parseInt(req.params.id);
    const serviceType = await emFork.findOneOrFail(TipoServicio, id, {
      populate: ['tareas'],
    });
    await emFork.removeAndFlush(serviceType);
    emFork.remove(serviceType);
    res
      .status(200)
      .json({ message: 'Service type deleted', data: serviceType });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function lookTipoServicio(Tareaid: number) {
  try {
    const tipoServicio = await em.findOneOrFail(TipoServicio, {
      tareas: { id: Tareaid },
    });
    return tipoServicio;
  } catch (error) {
    throw new Error('Tipo de servicio no encontrado');
  }
}

export {
  findAll,
  findAllWithTareas,
  findOne,
  add,
  update,
  remove,
  lookTipoServicio,
};
