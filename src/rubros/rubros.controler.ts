import { Request, Response, NextFunction } from 'express';
import { Rubro } from './rubros.entity.js';
import { orm } from '../shared/db/orm.js';
import { ObjectId } from '@mikro-orm/mongodb';

const em = orm.em;

function sanitizeRubroInput(req: Request, _res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll(_req: Request, res: Response) {
  try {
    const rubros = await em.find(Rubro, {}, { populate: ['beneficios'] });
    res.status(200).json({ message: 'found all rubros', data: rubros });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let rubroFound;
    try {
      rubroFound = await em.findOneOrFail(Rubro, { id }, { populate: ['beneficios'] });
    } catch (e) {
      rubroFound = await em.findOneOrFail(Rubro, { _id: new ObjectId(id) }, { populate: ['beneficios'] });
    }
    res.status(200).json({ message: 'found rubro', data: rubroFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const rubroCreated = em.create(Rubro, req.body.sanitizedInput);
    await em.flush();
    
    // Recargar con relaciones pobladas
    const rubroWithRelations = await em.findOne(Rubro, { _id: rubroCreated._id }, {
      populate: ['beneficios']
    });
    
    res.status(201).json({ message: 'rubro created', data: rubroWithRelations });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let rubroToUpdate;
    try {
      rubroToUpdate = await em.findOneOrFail(Rubro, { id }, { populate: ['beneficios'] });
    } catch (e) {
      rubroToUpdate = await em.findOneOrFail(Rubro, { _id: new ObjectId(id) }, { populate: ['beneficios'] });
    }
    em.assign(rubroToUpdate, req.body.sanitizedInput);
    await em.flush();
    
    // Recargar con relaciones pobladas
    const rubroUpdated = await em.findOne(Rubro, { _id: rubroToUpdate._id }, {
      populate: ['beneficios']
    });
    
    res.status(200).json({ message: 'rubro updated', data: rubroUpdated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let rubroToRemove;
    try {
      rubroToRemove = await em.findOneOrFail(Rubro, { id });
    } catch (e) {
      rubroToRemove = await em.findOneOrFail(Rubro, { _id: new ObjectId(id) });
    }
    await em.removeAndFlush(rubroToRemove);
    res.status(200).send({ message: 'rubro deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeRubroInput, findAll, findOne, add, update, remove };
