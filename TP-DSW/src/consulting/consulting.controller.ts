import { Request, Response, NextFunction } from 'express';
import { Consulting } from './consulting.entity.js';
import { orm } from '../shared/orm.js';

const em = orm.em;

function sanitizeConsultingInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    street: req.body.street,
    altStreet: req.body.altStreet,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
    try {
      const consultings = await em.find(Consulting, {});
      res
        .status(200)
        .json({ message: 'Found all consultings', data: consultings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const consulting = await em.find(Consulting, { id });
    res.status(200).json({ message: 'Found consulting', data: consulting });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
    try {
      const consulting = em.create(Consulting, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: 'Consulting created', data: consulting });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id);
      const ConsultingToUpdate = await em.findOneOrFail(Consulting, { id });
      em.assign(ConsultingToUpdate, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'Consulting updated', data: ConsultingToUpdate });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const consulting = em.getReference(Consulting, id);
    await em.removeAndFlush(consulting);
    res.status(200).json({ message: 'Consulting deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeConsultingInput, findAll, findOne, add, update, remove };
