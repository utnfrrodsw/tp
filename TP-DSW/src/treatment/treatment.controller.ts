import { Request, Response, NextFunction } from 'express';
import { Treatment } from './treatment.entity.js';
import { orm } from '../shared/orm.js'

const em = orm.em 

function sanitizeTreatmentInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description
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
    const treatments = await em.find(Treatment, {})
    res.status(200).json({ message: 'found all treatments', data: treatments })
  } catch (error: any)
    {
      res.status(500).json({ message: error.message })
    }
  }
  
async function findOne(req: Request, res: Response) {
  try {
      const id = Number.parseInt(req.params.id)
      const treatment = await em.findOneOrFail(Treatment, {id})
      res.status(200).json({ message: 'found treatment', data: treatment })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function add (req: Request, res: Response) {
    try {
      const treatment = em.create(Treatment, req.body.sanitizedInput)
      await em.flush()
      res.status(201).json({ message: 'Treatment created', data: treatment })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const treatmentToUpdate = await em.findOneOrFail(Treatment, { id })
      em.assign(treatmentToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'treatment updated', data: treatmentToUpdate })
    
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    }
  
  async function remove (req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const treatment = em.getReference(Treatment, id)
      await em.removeAndFlush(treatment)
      res.status(200).json({ message: 'Treatment deleted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
    }
  
  
  export { sanitizeTreatmentInput, findAll, findOne, add, update, remove};