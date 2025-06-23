import { Request, Response, NextFunction } from 'express';
import { Servicio } from './servicio.entity.js';
import { orm } from '../shared/db/orm.js';
import { Turno } from '../turno/turno.entity.js';

const em = orm.em;

function sanitizeServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizeServicioInput = {
    precio: req.body.precio,
    tarea: req.body.tarea,
    usuarios: req.body.usuarios,
    turnos: req.body.turnos,
  };
  Object.keys(req.body.sanitizeServicioInput).forEach((key) => {
    if (req.body.sanitizeServicioInput[key] === undefined) {
      delete req.body.sanitizeServicioInput[key];
    }
  });
  next();
}


// Find all services
async function findall(req: Request, res: Response) {
  try {
    const services = await em.find(
      Servicio,
      {},
      { populate: ['usuarios', 'tarea', 'turnos'] }
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
      { populate: ['usuarios', 'tarea', 'turnos'] }
    );
    res.status(200).json({ message: 'found one service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Add a new service
async function add(req: Request, res: Response) {
  try {
    const service = em.create(Servicio, req.body.sanitizeServicioInput);
    await em.persistAndFlush(service);
    res.status(201).json({ message: 'created service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update an existing service
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(Servicio, { id });
    em.assign(service, req.body.sanitizeServicioInput);
    await em.persistAndFlush(service);
    res.status(200).json({ message: 'updated service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Remove a service
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(Servicio, { id });
    await em.removeAndFlush(service);
    res.status(200).json({ message: 'removed service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export { sanitizeServicioInput, findall, findone, add, update, remove };
