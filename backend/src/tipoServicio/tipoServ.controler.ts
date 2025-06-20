import { NextFunction, Request, Response } from 'express';
import { TipoServicio } from './tipoServ.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;

function sanitizeServiceTypeInput(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreTipo: req.body.nombreTipo,
    descripcionTipo: req.body.descripcionTipo,
  };
  //*Checkeamos que no haya campos vacíos
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(_req: Request, res: Response) {
  try {
    const types = await em.find(
      TipoServicio,
      {}
      // { populate:['users'] }
    );
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
    const serviceType = em.create(TipoServicio, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'Service type created', data: serviceType });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const serviceTypeToUpdate = await em.findOneOrFail(TipoServicio, { id });
    em.assign(serviceTypeToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: 'Service type updated', data: serviceTypeToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const serviceType = em.getReference(TipoServicio, id);
    await em.removeAndFlush(serviceType);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeServiceTypeInput, findAll, findOne, add, update, remove };
